import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
// import * as euiLightVars from '@elastic/eui/dist/eui_theme_light.json';

import { backgroundColor, textColor } from '../config/theme/theme';
import SignIn from './SignIn';
import Tree from './Tree';

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${backgroundColor};
  color: ${textColor};
`;

export default () => {
  return (
    <ThemeProvider theme={{ mode: 'light' }}>
      <Router>
        <Container>
          <Switch>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/">
              <Tree />
            </Route>
          </Switch>
        </Container>
      </Router>
    </ThemeProvider>
  );
};
