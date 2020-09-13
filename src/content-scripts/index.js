/* global chrome */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import App from '../pages/App';
import RootStoreContext from '../config/store/context.ts';
import rootStore from '../config/store/root.store.ts';
import FirebaseProvider from '../config/firebase';

console.log('CS');

// eslint-disable-next-line no-restricted-globals
const isChrome = navigator.userAgent.indexOf('Firefox') === -1;

let rendered;
let bgConnection;
let naTimeout;
let preloadedState;
let app;

function renderNA() {}

function renderDevPanel() {
  // gives transition to html during offset
  document.querySelector('html').style.transition = `margin 0.1s`;
  app = document.createElement('nav');
  app.id = 'my-extension-root';
  app.style.display = 'block';
  document.body.append(app);

  unmountComponentAtNode(app);
  clearTimeout(naTimeout);
  render(
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RootStoreContext.Provider value={rootStore}>
      <FirebaseProvider store={rootStore}>
        <App />
      </FirebaseProvider>
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
