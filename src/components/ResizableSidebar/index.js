import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import { Scrollbars } from 'react-custom-scrollbars';
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
import { getScrollBarWidth } from '../../helpers/util';
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
  const uiStore = useUiStore();
  const { isLoggedIn } = useUserStore();
  const { pathname } = useLocation();
  const history = useHistory();
  const { sidebarWidth, isSidebarMinimized } = uiStore;

  const [extensionWidth, setExtensionWidth] = useState(sidebarWidth);
  const scrollbarWidth = getScrollBarWidth();

  const openSidebar = () => {
    if (!isSidebarMinimized) return;
    // maximize it
    setExtensionWidth(uiStore.sidebarWidth);
    uiStore.openSidebar();
    if (!isLoggedIn) history.push('/account-sign-in');
  };
  const closeSidebar = () => {
    if (isSidebarMinimized) return;
    // maximize it
    setExtensionWidth(0);
    uiStore.closeSidebar();
    history.push('/minimized');
  };

  // Give html margin-left of extension's width
  // Adjust body width
  useEffect(() => {
    document.querySelector('html').style.marginLeft = `${
      (isSidebarMinimized ? 0 : extensionWidth) + SIDE_TAB.WIDTH
    }px`;
    document.querySelector('body').style.minWidth = `calc(100vw - ${
      (isSidebarMinimized ? 0 : extensionWidth) +
      SIDE_TAB.WIDTH +
      scrollbarWidth
    }px)`;
  }, [extensionWidth, isSidebarMinimized]);

  // Keep local width in sync with width in uiStore/storage
  useEffect(() => {
    setExtensionWidth(sidebarWidth);
  }, [sidebarWidth]);

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
          size={{ width: extensionWidth, height: '100vh' }}
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
            setExtensionWidth(ref.offsetWidth); // set local component state
          }}
          onResizeStop={(_e, _direction, ref) => {
            uiStore.setSidebarWidth(ref.offsetWidth); // set ui store
          }}
        >
          {isPageWithHeader(pathname) && (
            <ExpandingContainerHeader>
              {getSidebarHeaderTitle(pathname)}
            </ExpandingContainerHeader>
          )}
          <ExpandingContainerContent>
            <Scrollbars
              style={{ width: '100%', height: '100%' }}
              autoHideTimeout={500}
              autoHide
            >
              {children}
            </Scrollbars>
          </ExpandingContainerContent>

          <ExpandingContainerDivider />
          <ExpandingContainerMinimizer>
            <IconButton
              Icon={<ChevronLeftIcon />}
              size={16}
              style={{ transform: 'scale(1.3 )' }}
              onClick={() => {
                if (isSidebarMinimized) {
                  openSidebar();
                } else {
                  closeSidebar();
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
