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

  if (!isPending && !user) {
    history.push('/signin');
    return <></>;
  }

  return (
    <Container>
      {isPending ? (
        'Loading...'
      ) : (
        <>
          Hello {JSON.stringify(user)}
          <button
            onClick={() => {
              firebase.signOut();
            }}
            type="button"
          >
            Sign out
          </button>
        </>
      )}
    </Container>
  );
});
