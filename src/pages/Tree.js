import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import useFirebaseDAO, { checkCurrentUser } from '../hooks/firebase';

const Container = styled.div`
  display: flex;
`;

export default observer(() => {
  const firebase = useFirebaseDAO();
  const { isPending, user } = checkCurrentUser();

  return (
    <Container>
      {isPending ? (
        'Loading...'
      ) : (
        <>
          Hello {JSON.stringify(user)}
          Welcome to the tree page
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
