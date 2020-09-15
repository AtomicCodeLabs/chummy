import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export default observer(() => {
  console.log('ACCOUNT PAGE');

  return <Container>Account Page</Container>;
});
