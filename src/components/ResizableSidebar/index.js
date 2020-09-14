import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';
import {
  FileIcon,
  SearchIcon,
  GitBranchIcon,
  GearIcon,
  PersonIcon,
  ChevronLeftIcon
} from '@primer/octicons-react';

import { EXTENSION_WIDTH, SIDE_TAB } from '../../constants/sizes';
import { useUiStore } from '../../hooks/store';
import { getScrollBarWidth } from '../../helpers/util';
import {
  Container,
  SideTab,
  SideTabButton,
  FlexGrow,
  ExpandingContainer,
  ExpandingContainerContent,
  ExpandingContainerDivider,
  ExpandingContainerMinimizer
} from './style';
import IconButton from '../IconButton';

const ResizableSidebar = observer(({ children }) => {
  const uiStore = useUiStore();
  const { pathname } = useLocation();
  const { sidebarWidth, isSidebarMinimized } = uiStore;
  const [extensionWidth, setExtensionWidth] = useState(sidebarWidth);
  const scrollbarWidth = getScrollBarWidth();

  // Give html margin-left of extension's width
  // Adjust body width
  useEffect(() => {
    document.querySelector('html').style.marginLeft = `${
      extensionWidth + SIDE_TAB.WIDTH
    }px`;
    document.querySelector('body').style.minWidth = `calc(100vw - ${
      extensionWidth + SIDE_TAB.WIDTH + scrollbarWidth
    }px)`;
  }, [extensionWidth]);

  // Keep local width in sync with width in uiStore/storage
  useEffect(() => {
    setExtensionWidth(sidebarWidth);
  }, [sidebarWidth]);

  return (
    <Container>
      <SideTab>
        <SideTabButton active={pathname === '/'}>
          <IconButton Icon={<FileIcon />} to="/" />
        </SideTabButton>
        <SideTabButton active={pathname === '/search'}>
          <IconButton Icon={<SearchIcon />} to="/search" />
        </SideTabButton>
        <SideTabButton active={pathname === '/vcs'}>
          <IconButton Icon={<GitBranchIcon />} to="/vcs" />
        </SideTabButton>
        <FlexGrow />
        <SideTabButton active={pathname === '/account'}>
          <IconButton Icon={<PersonIcon />} to="/account" />
        </SideTabButton>
        <SideTabButton active={pathname === '/settings'}>
          <IconButton Icon={<GearIcon />} to="/settings" />
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
          <ExpandingContainerContent>{children}</ExpandingContainerContent>
          <ExpandingContainerDivider />
          <ExpandingContainerMinimizer>
            <IconButton
              Icon={<ChevronLeftIcon />}
              size={16}
              style={{ transform: 'scale(1.3 )' }}
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
