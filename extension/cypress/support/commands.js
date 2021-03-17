const addExtensionCommands = require('cypress-browser-extension-plugin/commands');
const { interceptJS } = require('../utils/http');

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
// cypress/support/command.js
addExtensionCommands(Cypress);

// Find element by id
Cypress.Commands.add('findById', (id) => {
  return cy.get(`[data-testid=${id}]`, { timeout: 10000 });
});

// Navigate to sidebar page
Cypress.Commands.add('goTo', (pageName) => {
  let buttonTestId = 'route-button-';
  switch (pageName) {
    case 'Account':
      buttonTestId += 'account';
      break;
    case 'Bookmarks':
      buttonTestId += 'bookmarks';
      break;
    case 'Search':
      buttonTestId += 'search';
      break;
    case 'Settings':
      buttonTestId += 'settings';
      break;
    case 'Tree':
      break;
    case 'VCS':
      buttonTestId += 'vcs';
      break;
    default:
      cy.log('Could not navigate to unknown page', pageName);
      return;
  }
  interceptJS();
  cy.findById(buttonTestId).click();
});
