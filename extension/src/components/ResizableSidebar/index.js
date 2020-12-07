import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

import { sidebarRoutes } from '../../config/routes';
import { useUiStore, useUserStore } from '../../hooks/store';
import useWindowSize from '../../hooks/useWindowSize';
import { getSidebarHeaderTitle, isPageWithHeader } from './util';
import {
  Container,
  SideTab,
  SideTabButton,
  FlexGrow,
  ExpandingContainer,
  ExpandingContainerHeaderContainer,
  ExpandingContainerContent,
  ExpandingContainerHeaderSpacer,
  ExpandingContainerHeaderIcon
} from './style';
import IconButton from '../Buttons/IconButton';
import Spinner from '../Loading/Spinner';
import { SIDE_TAB, EXTENSION_WIDTH } from '../../constants/sizes';

const ResizableSidebar = observer(({ children }) => {
  const {
    pendingRequestCount,
    isSidebarMinimized,
    openSidebar,
    closeSidebar
  } = useUiStore();
  const { isLoggedIn } = useUserStore();
  const { pathname } = useLocation();
  useWindowSize({
    keepStoreUpdated: true,
    responsive: {
      underCallback: () => {
        // Close sidebar
        closeSidebar(); // Set UI State
        // history.push('/minimized'); // Redirect
      },
      overCallback: () => {
        // Open sidebar
        openSidebar(); // Set UI State
        // if (!isLoggedIn) {
        //   history.push('/account-sign-in'); // Redirect
        // }
      },
      maxWidth: SIDE_TAB.WIDTH * 2
    }
  });

  const openSidebarAndResetWidth = () => {
    openSidebar();
    // Resize window if opening from minimized state
    if (isSidebarMinimized) {
      window.resizeTo(EXTENSION_WIDTH.INITIAL, window.outerHeight);
    }
  };

  const sidebarHeaderTitle = useMemo(() => getSidebarHeaderTitle(pathname), [
    pathname
  ]);

  return (
    <Container>
      <SideTab isSidebarMinimized={isSidebarMinimized}>
        {sidebarRoutes &&
          sidebarRoutes.map((route) =>
            route.flex ? (
              <FlexGrow key="flex-grow" />
            ) : (
              <SideTabButton
                active={pathname === route.pathname}
                key={route.pathname}
              >
                <IconButton
                  Icon={route.icon}
                  to={route.pathname}
                  onClick={openSidebarAndResetWidth}
                  disabled={!isLoggedIn}
                  active={pathname === route.pathname}
                  dataTestId={`route-button-${route.pathname.slice(1)}`}
                />
              </SideTabButton>
            )
          )}
      </SideTab>
      <ExpandingContainer isSidebarMinimized={isSidebarMinimized}>
        {isPageWithHeader(pathname) && (
          <ExpandingContainerHeaderContainer data-testid="page-title">
            {sidebarHeaderTitle}
            <ExpandingContainerHeaderSpacer />
            {!!pendingRequestCount.get(sidebarHeaderTitle) && (
              <ExpandingContainerHeaderIcon>
                <Spinner />
              </ExpandingContainerHeaderIcon>
            )}
          </ExpandingContainerHeaderContainer>
        )}
        <ExpandingContainerContent>{children}</ExpandingContainerContent>
        {/* <ExpandingContainerDivider /> */}
      </ExpandingContainer>
    </Container>
  );
});

ResizableSidebar.propTypes = {
  children: PropTypes.node.isRequired
};

export default ResizableSidebar;
