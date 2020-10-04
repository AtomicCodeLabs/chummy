/* global chrome */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-named-as-default */
import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { render, unmountComponentAtNode } from 'react-dom';

import App from '../pages/App';
import ThemeProvider from '../config/theme/context';
import RootStoreContext from '../config/store/context.ts';
import rootStore from '../config/store/root.store.ts';
import FirebaseProvider from '../config/firebase';
import OctoProvider from '../config/octokit';
import getScrollBarWidth from '../hooks/getScrollBarWidth';
import './index.css';

let app;
const scrollbarWidth = getScrollBarWidth();

function renderDevPanel() {
  app = document.getElementById('my-extension-root');

  unmountComponentAtNode(app);
  render(
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RootStoreContext.Provider value={rootStore}>
      {/* MobX store for general data */}
      <OctoProvider store={rootStore}>
        {/* Github DAO for making requests */}
        <FirebaseProvider store={rootStore}>
          {/* Firebase store for auth */}
          <Router>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </Router>
        </FirebaseProvider>
      </OctoProvider>
    </RootStoreContext.Provider>,
    app
  );
}

function init() {
  const extensionLoaded = document.getElementById('#my-extension-root');
  if (!extensionLoaded) {
    renderDevPanel();
  }
}

init();
