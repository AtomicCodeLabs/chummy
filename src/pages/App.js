import React from 'react';
import styled from 'styled-components';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';

// eslint-disable-next-line import/no-named-as-default
import ThemeProvider from '../config/theme/context';
import ResizableSidebar from '../components/ResizableSidebar';
import SignIn from './SignIn';
import Tree from './Tree';
import { backgroundColor, textColor } from '../constants/theme';

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
              <Route path="/minimized">
                <Tree />
              </Route>
              <Route path="/">
                <Tree />
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
