import { BasePage } from './base.page.js';
import { aboutMeSelectors } from './selectors.js';

export class SamplePage extends BasePage {
  constructor(page, expect) {
    super(page, expect);
  }
  
  async open() {
    await super.open('');
  }
  
  async isProfileImagePresent() {
    return await super.isElementPresent(aboutMeSelectors.profileImage);
  }
}