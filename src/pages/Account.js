import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import useFirebaseDAO, { checkCurrentUser } from '../hooks/firebase';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export default observer(() => {
  const firebase = useFirebaseDAO();
  checkCurrentUser();

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
