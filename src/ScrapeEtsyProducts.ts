import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Browser, executablePath, Page, Puppeteer } from "puppeteer";
import { setTimeout } from "node:timers/promises";
import { Cluster } from "puppeteer-cluster";
import {
  setExtraHttpsHeaders,
  actLikeHuman,
  searchNiche,
  fillCheckoutForm
  // @ts-ignore
} from "./SimpleFunctions.ts";
// @ts-ignore
import { saveData } from "./SaveData.ts";
import { EXTRACTED_URLS, PRODUCT, PRODUCT_DETAILS } from "./Types";


const puppeteerExtra = puppeteer.use(StealthPlugin())
const url: string = 'https://www.etsy.com/'
// Would randomly choose between proxies to avoid bot detection
// I tried free ones but they are not reliable
const proxies: string[] = [
  'http://88.250.88.246:5314',
  'http://88.250.88.246:5314'
]
const scrapeEtsyProducts = async () => {
  try {
    const randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
    const browser: Browser = await puppeteerExtra.launch({
      headless: false,
      executablePath: executablePath(),
      args: ['--no-sandbox'],
    })

    const page: Page = await browser.newPage()
    const cookies = await page.cookies();
    let products: any = []

    /*
   Scrape selected number of products per page
   Supports pagination for scraping multiple pages at a time
   Gets their title,price,url and stores them in a JSON file
   */
    const saveAndScrapeProducts = async () => {
      let count: number = 0
      const amountOfPages: number = 1
      let allScrapedProducts: PRODUCT[] = []

      await page.waitForSelector('.search-pagination')
      const nextButton = await page.$('.search-pagination > li:last-child a')
      while (count < amountOfPages) {
        let scrapedProductsPerPage = await page.evaluate(() => {
          const numberOfProducts = 3;
          const products: HTMLElement[] = Array.from(document.querySelectorAll<HTMLElement>('.v2-listing-card')).slice(0, numberOfProducts)
          return products.map((item: Element) => {
            return {
              title: (item?.querySelector('a .v2-listing-card__info h3') as HTMLHeadElement)?.textContent?.trim(),
              price: (item?.querySelector('a .v2-listing-card__info .n-listing-card__price p .currency-value') as HTMLHeadElement)?.textContent,
              url: (item?.querySelector('a') as HTMLAnchorElement)?.getAttribute('href')
            }
          })

        })
        await setTimeout(1000)
        allScrapedProducts.push(...scrapedProductsPerPage)
        console.log(`Page scraped`)
        await nextButton?.evaluate(b => b.click())
        count += 1
      }
      await saveData(allScrapedProducts, 'scrapedProducts.json')
      products.push(...allScrapedProducts)
      return allScrapedProducts
    }

    await setExtraHttpsHeaders(page)
    await page.setViewport({ width: 1280, height: 720 });

    // @ts-ignore
    await page.goto(url, { timeout: 0 })


    await setTimeout(1000)
    const acceptCookiesDialog = await page.$('.wt-overlay__footer__action')
    if (acceptCookiesDialog !== null) {
      const acceptButton = await page.$('.wt-overlay__footer__action button')
      acceptButton?.evaluate((b: HTMLButtonElement) => b.click())
    }


    await actLikeHuman(page)
    await page.setCookie(...cookies);
    await setTimeout(2000)
    await searchNiche(page)

    await saveAndScrapeProducts()

    await setTimeout(2000);
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 2,
      puppeteerOptions: {
        headless: false,
        executablePath: executablePath(),
      }
    })

    // Get all extracted products URLs and indexes
    const extractedUrls: EXTRACTED_URLS[] = products.map((item: PRODUCT, index: number) => {
      return { urls: item.url, index }
    })

    const productsArray: PRODUCT_DETAILS[] = []

    await cluster.task(async ({ page, data: [urls, index] }) => {
      await page.setCookie(...cookies);
      await page.setViewport({ width: 1280, height: 720 });
      await setExtraHttpsHeaders(page)
      // @ts-ignore
      await page.goto(urls, { waitUntil: 'networkidle2' });
      await setTimeout(2000);
      await actLikeHuman(page)

      const product: PRODUCT_DETAILS = await page.evaluate(() => {
        const regex = /(\r\n|\n|\r)/gm
        const name = document.querySelector('[data-buy-box-listing-title="true"]')!.textContent!.trim()
        const price = document.querySelector('[data-buy-box-region="price"] p')!.childNodes[2]!.textContent!.trim()
        const desc = document.querySelector('[data-product-details-description-text-content]')!.textContent!.trim()
        const allOptions = Array.from(document.querySelectorAll('div[data-variation-number]'))
        const images = Array.from(document.querySelectorAll('.carousel-pane-list li img'))
        let availableOptions = null
        if (allOptions.length) {
          // Grabs all of the options and their names
          availableOptions = allOptions.map((item: any) => {
            const optionName = item.querySelector('div label [data-label]').textContent.trim()
            item.querySelector('div select').click()
            const options = Array.from(item.querySelectorAll('div select option')).slice(1).map((singleItem: any) => {
              return singleItem.textContent.replace(regex, '').trim()
            })
            return { [optionName]: options }
          })
        }
        // Grabs all of the product images
        const img = images.map((item: any) => {
          return item.getAttribute('src')
        })
        return { name, price, desc, availableOptions, img }
      })
      // Checks if product has personalized text area
      if (extractedUrls.length - 1 === index) {
        if ((await page.$('#listing-page-personalization-textarea')) !== null) {
          await page.locator('textarea').fill('Mateja');
        }

        const selectOptions = await page.$$('select[data-variation-number]')
        // Checks If there are required options on the product page it chooses the second one
        if (selectOptions !== null) {
          for (const item of selectOptions) {
            let option = await item.$$eval('option', e => e[2].value)
            const attr = await page.evaluate(el => el.getAttribute('data-variation-number'), item)
            await setTimeout(500)
            await page.select(`select#variation-selector-${attr}`, option)
          }
        }

        await setTimeout(2000)
        await page.click('[data-add-to-cart-button] button')
        await page.waitForNavigation()
        await page.$eval('button.proceed-to-checkout', e => e.click())
        await page.waitForSelector('#join_neu_email_field')
        const continueBtn = await page.$('[name="submit_attempt"]')
        continueBtn?.click()

        await page.waitForNavigation()
        await fillCheckoutForm(page)
        console.log('DONE!')
      }
      productsArray.push(product)
    })

    // Goes to all of the extracted urls and grabs their data
    for (const pageUrl of extractedUrls) {
      await setTimeout(500);
      await cluster.execute([pageUrl.urls, pageUrl.index])
    }

    await saveData(productsArray, 'clusterData.json');



    await cluster.idle();
    await cluster.close();

  } catch (e) {
    console.log(e)
  }
}


scrapeEtsyProducts()

