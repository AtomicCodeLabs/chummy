import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import {
  CodeIcon,
  SearchIcon,
  GitBranchIcon,
  GearIcon,
  PersonIcon
} from '@primer/octicons-react';

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
import IconButton from '../IconButton';
import Spinner from '../Spinner';
import { SIDE_TAB, EXTENSION_WIDTH } from '../../constants/sizes';

const ResizableSidebar = observer(({ children }) => {
  const {
    isPending,
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
        <SideTabButton active={pathname === '/'}>
          <IconButton
            Icon={<CodeIcon />}
            to="/"
            onClick={openSidebarAndResetWidth}
            disabled={!isLoggedIn}
          />
        </SideTabButton>
        <SideTabButton active={pathname === '/search'}>
          <IconButton
            Icon={<SearchIcon />}
            to="/search"
            onClick={openSidebarAndResetWidth}
            disabled={!isLoggedIn}
          />
        </SideTabButton>
        <SideTabButton active={pathname === '/vcs'}>
          <IconButton
            Icon={<GitBranchIcon />}
            to="/vcs"
            onClick={openSidebarAndResetWidth}
            disabled={!isLoggedIn}
          />
        </SideTabButton>
        <FlexGrow />
        <SideTabButton active={pathname === '/account'}>
          <IconButton
            Icon={<PersonIcon />}
            to="/account"
            onClick={openSidebarAndResetWidth}
            disabled={!isLoggedIn}
          />
        </SideTabButton>
        <SideTabButton active={pathname === '/settings'}>
          <IconButton
            Icon={<GearIcon />}
            to="/settings"
            onClick={openSidebarAndResetWidth}
            disabled={!isLoggedIn}
          />
        </SideTabButton>
      </SideTab>
      <ExpandingContainer isSidebarMinimized={isSidebarMinimized}>
        {isPageWithHeader(pathname) && (
          <ExpandingContainerHeaderContainer>
            {sidebarHeaderTitle}
            <ExpandingContainerHeaderSpacer />
            {isPending === sidebarHeaderTitle && isPending !== 'None' && (
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
  children: PropTypes.element.isRequired
};

export default ResizableSidebar;
