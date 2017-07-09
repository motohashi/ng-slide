import { NgSlidesPage } from './app.po';

describe('ng-slides App', () => {
  let page: NgSlidesPage;

  beforeEach(() => {
    page = new NgSlidesPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
