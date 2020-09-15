import React from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import useFirebaseDAO, { checkCurrentUser } from '../hooks/firebase';
import { useUserStore } from '../hooks/store';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

export default observer(() => {
  console.log('ACCOUNT SIGNIN PAGE');
  const firebase = useFirebaseDAO();
  const { isLoggedIn } = useUserStore();
  checkCurrentUser();

  return (
    <Container>
      {isLoggedIn ? (
        'Account Page'
      ) : (
        <button
          onClick={() => {
            firebase.signIn();
          }}
          type="button"
        >
          Sign into Github
        </button>
      )}
    </Container>
  );
});
