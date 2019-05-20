import { AppPage } from '../app-page.po';

export class GlobalHeaderUseCases {
  constructor(private page: AppPage) {
  }

  displaySitewideHeader() {
    expect(this.page.getElements('#menu-bar').count()).toEqual(1);
    expect(this.page.getElements('app-logo').count()).toEqual(1);
  }

  displayUtilityNav() {
    expect(this.page.getElements('#utility-nav').count()).toEqual(1);
  }

  displayLoggedOutState() {
    expect(this.page.getElements('#register-button').count()).toEqual(1);
    expect(this.page.getElements('#login-button').count()).toEqual(1);
    expect(this.page.getElements('#profile-button').count()).toEqual(0);
    expect(this.page.getElements('#logout-button').count()).toEqual(0);
  }

  displayLoggedInState() {
    expect(this.page.getElements('#register-button').count()).toEqual(0);
    expect(this.page.getElements('#login-button').count()).toEqual(0);
    expect(this.page.getElements('#profile-button').count()).toEqual(1);
    expect(this.page.getElements('#logout-button').count()).toEqual(1);
  }

  displayPrimaryNav() {
    expect(this.page.getElements('#primary-nav').count()).toEqual(1);
    expect(this.page.getElements('#enroll-button').count()).toEqual(1);
    expect(this.page.getElements('#studies-button').count()).toEqual(1);
    expect(this.page.getElements('#resources-button').count()).toEqual(1);
  }

  visitHomePage() {
    this.page.clickLinkTo('/home');
    expect(this.page.getElements('#cta').count()).toEqual(1);
    expect(this.page.getElements('#cta button').count()).toBeGreaterThan(1);
    expect(this.page.getElements('.hero-slides .hero-slide').count()).toBeGreaterThan(1);
    this.page.clickLinkTo('/home');
  }

  async displayHomeHero() {
    const numSlides = await this.page.getElements('.hero-slides .hero-slide').count();

    for (let i = 0; i < numSlides; i++) {
      this.page.clickElement(`.hero-slides .dots .dot:nth-of-type(${i + 1})`);
      expect(this.page.getElements(`.hero-slides .hero-slide:nth-of-type(${i + 1}).active`).count()).toEqual(1);
    }
  }

  visitEnrollPage() {
    this.page.clickLinkTo('/enroll');
    expect(this.page.getElements('.enroll').count()).toEqual(1);
    expect(this.page.getElements('#hero').count()).toEqual(1);
    expect(this.page.getElements('#feature').count()).toEqual(1);
    this.page.clickLinkTo('/home');
  }

  visitStudiesPage() {
    this.page.clickLinkTo('/studies');
    expect(this.page.getElements('.studies').count()).toEqual(1);
    expect(this.page.getElements('app-search-result').count()).toBeGreaterThan(1);
    this.page.clickLinkTo('/home');
  }

  visitResourcesSearchPage() {
    this.page.clickLinkTo('/search');
    expect(this.page.getElements('.applied-filters').count()).toEqual(1);
    expect(this.page.getElements('.filter-facet').count()).toBeGreaterThan(1);
    expect(this.page.getElements('app-search-result').count()).toBeGreaterThan(1);
    this.page.clickLinkTo('/home');
  }
}
