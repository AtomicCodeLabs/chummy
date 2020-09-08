import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { useFirebase } from '../hooks/firebase';
import { useUserStore } from '../hooks/store';

const Container = styled.div`
  display: flex;
`;

export default observer(() => {
  const history = useHistory();
  const firebase = useFirebase();
  const { isPending, user } = useUserStore();

  if (!isPending && user) {
    history.push('/');
    return <></>;
  }

  return (
    <Container>
      <button
        onClick={() => {
          firebase.signInWithGithub();
        }}
        type="button"
      >
        Sign into Github
      </button>
    </Container>
  );
});
