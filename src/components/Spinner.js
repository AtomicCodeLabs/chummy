// https://gist.github.com/adrianmcli/9fac3ff3c144c2805be90381eaa8d3d4
import styled, { keyframes } from 'styled-components';
import { nodeIconColor, nodeIconDarkColor } from '../constants/theme';

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Spinner = styled.div`
  animation: ${rotate360} 0.5s linear infinite;
  transform: translateZ(0);

  border-top: 2px solid ${nodeIconColor};
  border-right: 2px solid ${nodeIconColor};
  border-bottom: 2px solid ${nodeIconColor};
  border-left: 3px solid ${nodeIconDarkColor};
  background: transparent;
  width: ${({ size }) => size || 16}px;
  height: ${({ size }) => size || 16}px;
  border-radius: 50%;

  margin-left: ${({ marginLeft }) => marginLeft || 0};
  margin-right: ${({ marginRight }) => marginRight || 0};
`;

export default Spinner;
