/*
 Randomly switches between users to bypass bot detection
 */
import { Page } from "puppeteer";
import { setTimeout } from "node:timers/promises";

const generateRandomUser = () => {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15'
  ];
  // Get a random index based on the length of the user agents array
  const randomUAIndex = Math.floor(Math.random() * userAgents.length);
  // Return a random user-agent using the index above
  return userAgents[randomUAIndex];
};

export const setExtraHttpsHeaders = async (page: Page) => {
  await page.setExtraHTTPHeaders({
    'user-agent': generateRandomUser(),
    'upgrade-insecure-requests': '1',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,en;q=0.8'
  });
}

/*
    Moves and click on the page randomly to mimic human behavior
   */
export const actLikeHuman = async (page: Page) => {
  const minDelay = 500
  const maxDelay = 2000
  await page.mouse.move(Math.random() * (maxDelay - minDelay) + minDelay, Math.random() * (maxDelay - minDelay) + minDelay);
  await page.mouse.click(Math.random() * (maxDelay - minDelay) + minDelay, Math.random() * (maxDelay - minDelay) + minDelay);
  await page.evaluate(() => {
    window.scrollBy(0, window.innerHeight);
  });
}


export const searchNiche = async (page: Page) => {
  await page.waitForSelector('#global-enhancements-search-query')
  await setTimeout(1000)
  await page.type('#global-enhancements-search-query', 'Jackets')
  await setTimeout(500)
  await page.keyboard.press('Enter');
}

export const fillCheckoutForm = async (page: Page) => {
  await page.select('[name="country_id"]', '192')
  await page.type('#shipping-form-email-input', 'maxon4002@gmail.com')
  await setTimeout(2000)
  await page.type('#shipping-form-email-confirmation', 'maxon4002@gmail.com')
  await setTimeout(2000)
  await page.type('[data-field-container="name"] input', 'Mateja Drobnjak', { delay: 50 })
  await page.type('input[name="first_line"]', 'Kej 12. Srpske brigade', { delay: 50 })
  await page.type('input[name="city"]', 'Novi Pazar', { delay: 50 })

  await page.click('[data-selector-form-footer] button')
  await setTimeout(2000)
}

