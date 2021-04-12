/* eslint-disable import/no-named-as-default */
import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import { StyleSheetManager } from 'styled-components';

import App from '../App';
import ThemeProvider from '../../config/theme/context';
import RootStoreContext from '../../config/store/context';
import rootStore from '../../config/store/root.store';
import DAOProvider from '../../config/dao';
import OctoProvider from '../../config/octokit';
import { getStyles } from '../../utils';

console.log(
  `<!DOCTYPE html><html><head>${getStyles()}</head><body><div class="frame-root"></div></body></html>`
);

const Root = () => (
  <Frame
    initialContent={`<!DOCTYPE html><html><head>${getStyles()}</head><body><div class="frame-root"></div></body></html>`}
  >
    <FrameContextConsumer>
      {(frameContext) => (
        <StyleSheetManager target={frameContext.document.head}>
          <RootStoreContext.Provider value={rootStore}>
            {/* MobX store for general data */}
            <OctoProvider store={rootStore}>
              {/* GitHub DAO for making requests */}
              <DAOProvider store={rootStore}>
                {/* Firebase store for auth */}
                <Router>
                  <ThemeProvider>
                    <App />
                  </ThemeProvider>
                </Router>
              </DAOProvider>
            </OctoProvider>
          </RootStoreContext.Provider>
        </StyleSheetManager>
      )}
    </FrameContextConsumer>
  </Frame>
);

export default Root;
