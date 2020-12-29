import styled from 'styled-components';

import { HEADER } from '../../constants/sizes';

export default styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: calc(100vh - ${HEADER.HEIGHT}px);
`;
