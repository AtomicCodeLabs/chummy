import React from 'react';
import styled from 'styled-components';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';

// eslint-disable-next-line import/no-named-as-default
import ThemeProvider from '../config/theme/context';
import { backgroundColor, textColor } from '../constants/theme';

import ResizableSidebar from '../components/ResizableSidebar';
import Tree from './Tree';
import Search from './Search';
import Vcs from './Vcs';
import Account from './Account';
import Settings from './Settings';
import SignIn from './SignIn';

// Split into left sidebar and right sidebar.
// Both are horizontal resizable containers -
// https://elastic.github.io/eui/#/layout/resizable-container

const ExtensionRootContainer = styled.div`
  position: fixed;
  display: flex;

  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
  z-index: -10000;

  /* background-color: ${backgroundColor}; */
  color: ${textColor};
`;

export default () => {
  return (
    <Router>
      <ThemeProvider>
        <ExtensionRootContainer>
          <ResizableSidebar>
            <Switch>
              <Route path="/signin">
                <SignIn />
              </Route>
              <Route exact path="/">
                <Tree />
              </Route>
              <Route path="/search">
                <Search />
              </Route>
              <Route path="/vcs">
                <Vcs />
              </Route>
              <Route path="/account">
                <Account />
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/minimized">
                <></>
              </Route>
            </Switch>
          </ResizableSidebar>
          {/* <ResizeHandle />
          <Right></Right> */}
        </ExtensionRootContainer>
      </ThemeProvider>
    </Router>
  );
};
