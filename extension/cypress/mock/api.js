import browser from 'sinon-chrome';
import { interceptJS } from '../utils/http';

export default () => {
  browser.runtime.id = 'testid'; // workaround https://github.com/mozilla/webextension-polyfill/issues/218

  interceptJS();

  // Retrieve test data
  cy.fixture('user').then((user) => {
    cy.fixture('bookmarks').then((bookmarks) => {
      cy.fixture('repositories').then((repositories) => {
        cy.fixture('store').then((store) => {
          browser.runtime.sendMessage
            .withArgs({ action: 'get-current-user' })
            .yields(user);
          browser.runtime.sendMessage
            .withArgs({ action: 'get-open-repositories' })
            .yields(repositories);
          browser.runtime.sendMessage
            .withArgs({
              action: 'get-store',
              payload: Object.keys(store.payload)
            })
            .yields(store);
          browser.runtime.sendMessage
            .withArgs({ action: 'get-bookmarks' })
            .yields(bookmarks);

          // Load your popup
          cy.visit(`popup.html`, {
            // If you need to stub `chrome*` API, you should do it there:
            onBeforeLoad(win) {
              global.chrome = browser;
              win.chrome = browser;
            }
          });
        });
      });
    });
  });
};
