import { useContext } from 'react';
import { ThemeContext } from 'styled-components';

export default () => {
  return useContext(ThemeContext);
};
