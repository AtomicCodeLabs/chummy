import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useUiStore } from '../../hooks/store';

export const ThemeToggleContext = createContext();

export const ThemeProvider = observer(({ children }) => {
  const { theme, spacing } = useUiStore();

  return (
    <ThemeToggleContext.Provider>
      <SCThemeProvider theme={{ theme, spacing }}>{children}</SCThemeProvider>
    </ThemeToggleContext.Provider>
  );
});

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default ThemeProvider;
