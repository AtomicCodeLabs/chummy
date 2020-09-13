import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Rnd } from 'react-rnd';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';

import { backgroundColor, textColor } from '../constants/theme';
import { EXTENSION_WIDTH, SIDE_TAB_WIDTH } from '../constants/sizes';
import { useUiStore } from '../hooks/store';

const Container = styled.div`
  background-color: green;
  width: ${SIDE_TAB_WIDTH}px;
  height: 100vh;
  z-index: 10000;

  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const SideTab = styled.div`
  background-color: lightblue;
  width: ${SIDE_TAB_WIDTH}px;
  z-index: 9999;
  overflow: hidden;
`;

const Expandable = styled(Rnd)`
  background-color: ${backgroundColor};
  color: ${textColor};
  z-index: 9998;
  overflow: hidden;
`;

const ResizableSidebar = observer(({ children }) => {
  const uiStore = useUiStore();
  const { sidebarWidth, isSidebarMinimized } = uiStore;
  const [extensionWidth, setExtensionWidth] = useState(sidebarWidth);

  // Give html margin-left of extension's width
  useEffect(() => {
    document.querySelector('html').style.marginLeft = `${
      extensionWidth + SIDE_TAB_WIDTH
    }px`;
  }, [extensionWidth]);

  // Keep local width in sync with width in uiStore/storage
  useEffect(() => {
    setExtensionWidth(sidebarWidth);
  }, [sidebarWidth]);

  console.log('width', extensionWidth);

  return (
    <Container>
      {!isSidebarMinimized && <SideTab>Hello</SideTab>}
      <Expandable
        position={{ x: SIDE_TAB_WIDTH, y: 0 }}
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
