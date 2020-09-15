/* global chrome */
/* eslint-disable no-unused-vars */
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import App from '../pages/App';
import RootStoreContext from '../config/store/context.ts';
import rootStore from '../config/store/root.store.ts';
import FirebaseProvider from '../config/firebase';
import OctoProvider from '../config/octokit';

// eslint-disable-next-line no-restricted-globals
const isChrome = navigator.userAgent.indexOf('Firefox') === -1;

let rendered;
let bgConnection;
let naTimeout;
let preloadedState;
let app;

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
  rendered = true;
}

function init() {
  console.log('INIT');
  renderNA();
  if (!rendered) renderDevPanel();
}

init();

function toggle() {
  if (app.style.display === 'none') {
    app.style.display = 'block';
  } else {
    app.style.display = 'none';
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('got message');
  if (request.message === 'clicked_browser_action') {
    toggle();
  }
});
