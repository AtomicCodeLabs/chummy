import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

const Spacer = styled.div`
  width: ${({ level }) => 30 * level}px;
  min-width: ${({ level }) => 30 * level}px;
`;

const Icon = styled.div`
  /* rotate a right caret icon */
  transform: rotate(${({ open }) => (open ? 90 : 0)});
`;

const Name = styled.div``;
export default {
  Container,
  Spacer,
  Icon,
  Name
};
