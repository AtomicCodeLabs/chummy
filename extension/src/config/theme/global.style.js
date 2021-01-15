import { createGlobalStyle } from 'styled-components';

import Inter400 from '../../../public/font/inter-v2-latin-regular.woff';
import Inter400Two from '../../../public/font/inter-v2-latin-regular.woff2';
import Inter600 from '../../../public/font/inter-v2-latin-600.woff';
import Inter600Two from '../../../public/font/inter-v2-latin-600.woff2';

export default createGlobalStyle`
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    src:
      url('${Inter400Two}') format('woff2'),
      url('${Inter400}') format('woff');
  }

  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 600;
    src:
      url('${Inter600Two}') format('woff2'),
      url('${Inter600}') format('woff');
  }
 
  html, body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica,
    Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }
`;
