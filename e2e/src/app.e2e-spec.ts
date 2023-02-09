import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  // it('should display welcome message', () => {
  //   page.navigateTo();
  //   expect(page.getParagraphText()).toBe('Welcome to leaderLink!');
  // });

  it('the app should be rendered', () => {
    page.navigateTo(); // navigate to the app
    browser.driver.manage().window().maximize(); // optional: maximize the browser before executing the test
    expect(page.isAppRendered()).toEqual(true);
    // browser.sleep(1000);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({ level: logging.Level.SEVERE } as logging.Entry));
  });
});
