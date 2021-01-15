import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ExtensionRootContainer from '../../components/Containers/ExtensionRootContainer';
import ResizableSidebar from '../../components/ResizableSidebar';
import { routes } from '../../config/routes';

// Split into left sidebar and right sidebar.
// Both are horizontal resizable containers -
// https://elastic.github.io/eui/#/layout/resizable-container

export default () => {
  return (
    <ExtensionRootContainer>
      <ResizableSidebar>
        <Switch>
          {routes &&
            routes.map((route) => (
              <Route
                exact={route.pathname === '/'}
                path={route.pathname}
                key={route.pathname}
              >
                {route.component}
              </Route>
            ))}
        </Switch>
      </ResizableSidebar>
    </ExtensionRootContainer>
  );
};
