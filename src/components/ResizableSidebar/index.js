import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react-lite';

import { Container, SideTab, SideTabButton, Expandable } from './style';
import { EXTENSION_WIDTH, SIDE_TAB } from '../../constants/sizes';
import { useUiStore } from '../../hooks/store';
import { getScrollBarWidth } from '../../helpers/util';

import FilesIcon from '../../icons/light/files.svg';
import SearchIcon from '../../icons/light/search.svg';
import SourceControlIcon from '../../icons/light/source-control.svg';
import SettingsIcon from '../../icons/light/settings-gear.svg';

const ResizableSidebar = observer(({ children }) => {
  const uiStore = useUiStore();
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

  console.log('width', extensionWidth);

  return (
    <Container>
      {!isSidebarMinimized && (
        <SideTab>
          <SideTabButton>
            <FilesIcon />
          </SideTabButton>
          <SideTabButton>
            <SearchIcon />
          </SideTabButton>
          <SideTabButton>
            <SourceControlIcon />
          </SideTabButton>
          <SideTabButton>
            <SettingsIcon />
          </SideTabButton>
        </SideTab>
      )}
      <Expandable
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
        {children}
      </Expandable>
    </Container>
  );
});

ResizableSidebar.propTypes = {
  children: PropTypes.element.isRequired
};

export default ResizableSidebar;
