import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ExtensionRootContainer from '../components/ExtensionRootContainer';
import ResizableSidebar from '../components/ResizableSidebar';
import Tree from './Tree';
import Search from './Search';
import Vcs from './Vcs';
import Account from './Account';
import AccountSignIn from './Account/SignIn';
import Settings from './Settings';

// Split into left sidebar and right sidebar.
// Both are horizontal resizable containers -
// https://elastic.github.io/eui/#/layout/resizable-container

export default () => {
  return (
    <ExtensionRootContainer>
      <ResizableSidebar>
        <Switch>
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
          <Route path="/account-sign-in">
            <AccountSignIn />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
          <Route path="/minimized">
            <></>
          </Route>
        </Switch>
      </ResizableSidebar>
    </ExtensionRootContainer>
  );
};
