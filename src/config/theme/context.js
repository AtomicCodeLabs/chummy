import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useUiStore } from '../../hooks/store';

const ThemeToggleContext = createContext({
  toggle: () => {}
});

export const useTheme = () => useContext(ThemeToggleContext);

export const ThemeProvider = observer(({ children }) => {
  const uiStore = useUiStore();
  console.log('UISTORE', uiStore, uiStore.theme);

  const toggle = () => {
    uiStore.toggleTheme();
  };

  return (
    <ThemeToggleContext.Provider value={{ toggle }}>
      <SCThemeProvider theme={{ theme: uiStore.theme }}>
        {children}
      </SCThemeProvider>
    </ThemeToggleContext.Provider>
  );
});

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ThemeProvider;
