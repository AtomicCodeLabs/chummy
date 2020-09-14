import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { checkCurrentUser } from '../hooks/firebase';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export default observer(() => {
  checkCurrentUser();

  return <Container>VCS Page</Container>;
});
