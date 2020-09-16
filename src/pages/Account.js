import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import useFirebaseDAO from '../hooks/firebase';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export default observer(() => {
  console.log('ACCOUNT PAGE');
  const firebase = useFirebaseDAO();

  return (
    <Container>
      Account Page
      <button
        type="button"
        onClick={() => {
          firebase.signOut();
        }}
      >
        Sign out
      </button>
    </Container>
  );
});
