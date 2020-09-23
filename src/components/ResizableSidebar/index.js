import React, { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import {
  CodeIcon,
  SearchIcon,
  GitBranchIcon,
  GearIcon,
  PersonIcon,
  ChevronLeftIcon
} from '@primer/octicons-react';

import { EXTENSION_WIDTH, SIDE_TAB } from '../../constants/sizes';
import { useUiStore, useUserStore } from '../../hooks/store';
import { getSidebarHeaderTitle, isPageWithHeader } from './util';
import getScrollBarWidth from '../../hooks/getScrollBarWidth';
import {
  Container,
  SideTab,
  SideTabButton,
  FlexGrow,
  ExpandingContainer,
  ExpandingContainerHeader,
  ExpandingContainerContent,
  ExpandingContainerDivider,
  ExpandingContainerMinimizer
} from './style';
import IconButton from '../IconButton';

const ResizableSidebar = observer(({ children }) => {
  const {
    sidebarWidth,
    isSidebarMinimized,
    setSidebarWidth,
    openSidebar,
    closeSidebar
  } = useUiStore();
  const { isLoggedIn } = useUserStore();
  const { pathname } = useLocation();
  const history = useHistory();
  const scrollbarWidth = getScrollBarWidth();

  // Parent DOM elements to compute once
  const $html = document.querySelector('html');
  const $body = document.querySelector('body');

  const open = () => {
    if (!isSidebarMinimized) return;
    openSidebar();
    if (!isLoggedIn) history.push('/account-sign-in');
  };
  const close = () => {
    if (isSidebarMinimized) return;
    closeSidebar();
    history.push('/minimized');
  };

  // Give html margin-left of extension's width
  // Adjust body width
  useEffect(() => {
    $html.style.marginLeft = `${
      (isSidebarMinimized ? 0 : sidebarWidth) + SIDE_TAB.WIDTH
    }px`;
    $body.style.minWidth = `calc(100vw - ${
      (isSidebarMinimized ? 0 : sidebarWidth) + SIDE_TAB.WIDTH + scrollbarWidth
    }px)`;
  }, [sidebarWidth, isSidebarMinimized]);

  return (
    <Container>
      <SideTab>
        <SideTabButton active={pathname === '/'}>
          <IconButton
            Icon={<CodeIcon />}
            to="/"
            onClick={openSidebar}
            disabled={!isLoggedIn}
          />
        </SideTabButton>
        <SideTabButton active={pathname === '/search'}>
          <IconButton
            Icon={<SearchIcon />}
            to="/search"
            onClick={openSidebar}
            disabled={!isLoggedIn}
          />
        </SideTabButton>
        <SideTabButton active={pathname === '/vcs'}>
          <IconButton
            Icon={<GitBranchIcon />}
            to="/vcs"
            onClick={openSidebar}
            disabled={!isLoggedIn}
          />
        </SideTabButton>
        <FlexGrow />
        <SideTabButton active={pathname === '/account'}>
          <IconButton
            Icon={<PersonIcon />}
            to="/account"
            onClick={openSidebar}
            disabled={!isLoggedIn}
          />
        </SideTabButton>
        <SideTabButton active={pathname === '/settings'}>
          <IconButton
            Icon={<GearIcon />}
            to="/settings"
            onClick={openSidebar}
            disabled={!isLoggedIn}
          />
        </SideTabButton>
      </SideTab>
      {!isSidebarMinimized && (
        <ExpandingContainer
          position={{ x: SIDE_TAB.WIDTH, y: 0 }}
          size={{ width: sidebarWidth, height: '100vh' }}
          minWidth={EXTENSION_WIDTH.MIN}
          maxWidth={EXTENSION_WIDTH.MAX}
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
            setSidebarWidth(ref.offsetWidth);
          }}
          onResizeStop={(_e, _direction, ref) => {
            setSidebarWidth(ref.offsetWidth, true); // set ui store
          }}
        >
          {isPageWithHeader(pathname) && (
            <ExpandingContainerHeader>
              {getSidebarHeaderTitle(pathname)}
            </ExpandingContainerHeader>
          )}
          <ExpandingContainerContent>{children}</ExpandingContainerContent>
          <ExpandingContainerDivider />
          <ExpandingContainerMinimizer>
            <IconButton
              Icon={<ChevronLeftIcon />}
              size={16}
              style={{ transform: 'scale(1.3 )' }}
              onClick={() => {
                if (isSidebarMinimized) {
                  open();
                } else {
                  close();
                }
              }}
            />
          </ExpandingContainerMinimizer>
        </ExpandingContainer>
      )}
    </Container>
  );
});

ResizableSidebar.propTypes = {
  children: PropTypes.element.isRequired
};

export default ResizableSidebar;
