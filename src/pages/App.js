import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Rnd } from 'react-rnd';

// eslint-disable-next-line import/no-named-as-default
import ThemeProvider from '../config/theme/context';
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
  z-index: 10000;

  /* background-color: ${backgroundColor}; */
  color: ${textColor};
`;
const Left = styled(Rnd)`
  background-color: ${backgroundColor};
  color: ${textColor};
`;

const INITIAL_EXTENSION_WIDTH = 200;

export default () => {
  const [extensionWidth, setExtensionWidth] = useState(INITIAL_EXTENSION_WIDTH);

  useEffect(() => {
    // Give html margin-left of extension's width
    document.querySelector('html').style.marginLeft = `${extensionWidth}px`;
    console.log('HTML', document.querySelector('html'));
  }, [extensionWidth]);

  console.log('width', extensionWidth);

  return (
    <Router>
      <ThemeProvider>
        <ExtensionRootContainer>
          <Left
            position={{ x: 0, y: 0 }}
            size={{ width: extensionWidth, height: '100vh' }}
            minWidth={INITIAL_EXTENSION_WIDTH}
            maxWidth="50%"
            enableResizing={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false
            }}
            disableDragging
            bounds=".my-extension-root"
            onResize={(_e, _direction, ref) => {
              setExtensionWidth(ref.offsetWidth);
            }}
          >
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
          </Left>
          {/* <ResizeHandle />
          <Right></Right> */}
        </ExtensionRootContainer>
      </ThemeProvider>
    </Router>
  );
};
