import styled from 'styled-components';
import { NODE } from '../../constants/sizes';
import {
  backgroundHighlightColor,
  nodeTextColor,
  nodeIconColor
} from '../../constants/theme';

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 0.1rem;
  padding-bottom: 0.1rem;
  padding-left: 0.8rem;

  cursor: pointer;

  &:hover {
    background-color: ${backgroundHighlightColor} !important;
  }
`;

const Spacer = styled.div`
  display: flex;
  width: ${({ level }) => 30 * level}px;
  min-width: ${({ level }) => 30 * level}px;
`;

const Icon = styled.div`
  /* rotate a right caret icon */
  /* line-height: ${NODE.HEIGHT}px; */
  display: flex;
  margin-left: 0.2rem;
  margin-right: 0.3rem;

  svg {
    fill: ${({ iconFill }) => iconFill || nodeIconColor};
  }
`;

const Name = styled.div`
  /* line-height: ${NODE.HEIGHT}px; */
  font-size: 0.83rem;
  user-select: none;
  color: ${nodeTextColor};
`;

export default {
  Container,
  Spacer,
  Icon,
  Name
};
