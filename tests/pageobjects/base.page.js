const FRAMEWORK = process.env.FRAMEWORK;

export class BasePage {
  constructor(page, expect) {
    this.page = page;
    this.expect = expect;
  }
  async open(path = '') {
    if (FRAMEWORK === 'wdio') {
      await browser.url(path);
    } else if (FRAMEWORK === 'playwright') {
      await this.page.goto(path);
    }
  }
  async isElementPresent(selector) {
    if (FRAMEWORK === 'wdio') {
      return await $(selector).isExisting(selector);
    } else if (FRAMEWORK === 'playwright') {
      return await this.expect(this.page.locator(selector)).toBeVisible();
    }
  }
}