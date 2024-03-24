const timeout = 5000;


describe('/ (Home Page)', () => {
  let page;
  beforeAll(async () => {
    page = await globalThis.__BROWSER_GLOBAL__.newPage();
    await page.goto('https://etsy.com');
  }, timeout);

  it('should load without error', async () => {
    const text = await page.evaluate(() => document.body.textContent);
    expect(text).toContain('etsy');
  });

})
