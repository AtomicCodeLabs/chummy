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
  const firebase = useFirebaseDAO();
  // const { isPending } = checkCurrentUser();

  return (
    <Container>
      <button
        onClick={() => {
          firebase.signIn();
        }}
        type="button"
      >
        Sign into Github
      </button>
    </Container>
  );
});
