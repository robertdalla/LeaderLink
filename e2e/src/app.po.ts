import { browser, by, element } from 'protractor';

export class AppPage {

  navigateTo() {
    return browser.get(browser.baseUrl);
  }

  // getParagraphText() {
  //   return element(by.className('appRendered')).getText() as Promise<string>;
  // }

  isAppRendered() {
    return element(by.id('appRendered')).isPresent() as Promise<boolean>;
  }
}
