/* global chrome */
/* eslint-disable no-unused-vars */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import App from '../pages/App';
import RootStoreContext from '../config/store/context.ts';
import rootStore from '../config/store/root.store.ts';
import FirebaseProvider from '../config/firebase';
import OctoProvider from '../config/octokit';
import { getFromChromeStorage } from '../config/store/util.ts';
import { SIDE_TAB } from '../constants/sizes';
import { getScrollBarWidth } from '../helpers/util';
import './index.css';

// eslint-disable-next-line no-restricted-globals
const isChrome = navigator.userAgent.indexOf('Firefox') === -1;

let naTimeout;
let app;
const scrollbarWidth = getScrollBarWidth();

function renderNA() {}

function renderDevPanel() {
  app = document.createElement('nav');
  app.id = 'my-extension-root';
  app.style.display = 'block';
  document.body.append(app);

  unmountComponentAtNode(app);
  clearTimeout(naTimeout);
  render(
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RootStoreContext.Provider value={rootStore}>
      {/* MobX store for general data */}
      <OctoProvider store={rootStore}>
        {/* Github DAO for making requests */}
        <FirebaseProvider store={rootStore}>
          {/* Firebase store for auth */}
          <App />
        </FirebaseProvider>
      </OctoProvider>
    </RootStoreContext.Provider>,
    app
  );
}

function init() {
  renderNA();
  const extensionLoaded = document.querySelector('#my-extension-root');
  if (!extensionLoaded) {
    renderDevPanel();
  }
}

init();

function toggle() {
  if (app.style.display === 'none') {
    app.style.display = 'block';

    // Reset previous width
    getFromChromeStorage(
      ['isSidebarMinimized', 'sidebarWidth'],
      ({ isSidebarMinimized, sidebarWidth }) => {
        document.querySelector('html').style.marginLeft = `${
          (isSidebarMinimized ? 0 : sidebarWidth) + SIDE_TAB.WIDTH
        }px`;
        document.querySelector('body').style.minWidth = `calc(100vw - ${
          (isSidebarMinimized ? 0 : sidebarWidth) +
          SIDE_TAB.WIDTH +
          scrollbarWidth
        }px)`;
      }
    );
  } else {
    app.style.display = 'none';

    // Reset extensionless state
    document.querySelector('html').style.marginLeft = 0;
    document.querySelector('body').style.minWidth = '100vw';
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('got message', request);
  if (request.message === 'clicked_page_action') {
    toggle();
  }
});
