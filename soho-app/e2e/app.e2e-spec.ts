import { SohoAppPage } from './app.po';

describe('soho-app App', () => {
  let page: SohoAppPage;

  beforeEach(() => {
    page = new SohoAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
