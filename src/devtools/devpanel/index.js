/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import browser from 'webextension-polyfill';

import App from '../../pages/App';
import RootStoreContext from '../../config/store/context.ts';
import rootStore from '../../config/store/root.store.ts';
import FirebaseProvider from '../../config/firebase';

// eslint-disable-next-line no-restricted-globals
const isChrome = navigator.userAgent.indexOf('Firefox') === -1;

let rendered;
let bgConnection;
let naTimeout;
let preloadedState;

function renderNA() {}

function renderDevPanel() {
  const node = document.getElementById('container');
  unmountComponentAtNode(node);
  clearTimeout(naTimeout);
  render(
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RootStoreContext.Provider value={rootStore}>
      <FirebaseProvider store={rootStore}>
        <App />
      </FirebaseProvider>
    </RootStoreContext.Provider>,
    node
  );
  rendered = true;
}

function init(id) {
  renderNA();
  if (!rendered) renderDevPanel();
}

init(browser.devtools.inspectedWindow.tabId);
