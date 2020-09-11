import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import useFirebaseDAO from '../hooks/firebase';
import { useUserStore } from '../hooks/store';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export default observer(() => {
  const history = useHistory();
  const firebase = useFirebaseDAO();
  const { isPending, user } = useUserStore();

  if (!isPending && user) {
    history.push('/');
    return <></>;
  }

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
