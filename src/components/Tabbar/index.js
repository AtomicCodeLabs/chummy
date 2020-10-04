import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { observer } from 'mobx-react-lite';

import styled from 'styled-components';
import { useUiStore } from '../../hooks/store';
import { SIDE_TAB, TOP_TAB } from '../../constants/sizes';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  position: fixed;
  z-index: 10000;
  top: 0;
  left: ${({ marginLeft }) => marginLeft}px;

  height: ${TOP_TAB.HEIGHT}px;
  width: 100%;

  background-color: lightblue;
`;

const Tabbar = observer(() => {
  const { sidebarWidth, isSidebarMinimized, isTabbarMinimized } = useUiStore();

  // Add as Portal so that it will overlap over original site
  const [container] = useState(() => {
    const el = document.createElement('div');
    el.classList.add('tabbar');
    return el;
  });
  useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  // Parent DOM elements to compute once
  const $html = document.querySelector('html');

  // Give html margin-top of tabbar height
  useEffect(() => {
    $html.style.marginTop = `${isTabbarMinimized ? 0 : TOP_TAB.HEIGHT}px`;
  }, [isTabbarMinimized]);

  // Give tabbar margin-left of extension's width
  const marginLeft = (isSidebarMinimized ? 0 : sidebarWidth) + SIDE_TAB.WIDTH;

  return createPortal(
    <Container marginLeft={marginLeft}>TABBAR</Container>,
    container
  );
});

export default Tabbar;
