import mockApi from '../mock/api';

describe('Render each page', () => {
  before('set sidebar viewport', () => {
    mockApi();
  });

  beforeEach(() => {
    cy.viewport(400, 1000);
  });

  afterEach(() => {
    cy.clearCookies();
  });

  describe('Account', () => {
    it('page title is `Account`', () => {
      cy.goTo('Account');
      cy.findById('page-title').should('contain.text', 'Account');
    });
  });

  describe('Bookmarks', () => {
    it('page title is `Bookmarks`', () => {
      cy.goTo('Bookmarks');
      cy.findById('page-title').should('contain.text', 'Bookmarks');
    });
  });

  describe('Search', () => {
    it('page title is `Search`', () => {
      cy.goTo('Search');
      cy.findById('page-title').should('contain.text', 'Search');
    });
  });

  describe('Settings', () => {
    it('page title is `Settings`', () => {
      cy.goTo('Settings');
      cy.findById('page-title').should('contain.text', 'Settings');
    });
  });

  describe('Tree', () => {
    it('page title is `Explorer`', () => {
      cy.goTo('Tree');
      cy.findById('page-title').should('contain.text', 'Explorer');
    });
  });

  describe('VCS', () => {
    it('page title is `Source Control`', () => {
      cy.goTo('VCS');
      // cy.findById('page-title').should('contain.text', 'Source Control');
    });
  });
});
