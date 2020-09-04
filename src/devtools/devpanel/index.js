/* global chrome */
/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import App from '../../components/App';

// eslint-disable-next-line no-restricted-globals
const position = location.hash;
const isChrome = navigator.userAgent.indexOf('Firefox') === -1;

let rendered;
let store;
let bgConnection;
let naTimeout;
let preloadedState;

function renderNA() {}

function renderDevPanel() {
  const node = document.getElementById('container');
  unmountComponentAtNode(node);
  clearTimeout(naTimeout);
  // store = configureStore(position, bgConnection, preloadedState);
  render(
    // <Provider store={store}>
    <App position={position} />,
    // </Provider>,
    node
  );
  rendered = true;
}

function init(id) {
  renderNA();
  bgConnection = chrome.runtime.connect({
    name: id ? id.toString() : undefined
  });
  // bgConnection.onMessage.addListener((message) => {
  //   if (message.type === 'NA') {
  //     if (message.id === id) renderNA();
  //     else store.dispatch({ type: REMOVE_INSTANCE, id: message.id });
  //   } else {
  //     if (!rendered) renderDevPanel();
  //     store.dispatch(message);
  //   }
  // });
  if (!rendered) renderDevPanel();
}

init(chrome.devtools.inspectedWindow.tabId);
