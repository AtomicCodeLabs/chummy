import React, { useEffect } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import useFirebaseDAO, { checkCurrentUser } from '../hooks/firebase';
import useOctoDAO from '../hooks/octokit';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default observer(() => {
  console.log('TREE PAGE');
  const firebase = useFirebaseDAO();
  const { user } = checkCurrentUser();
  const octoDAO = useOctoDAO();

  useEffect(() => {
    const getRepository = async () => {
      octoDAO.getRepository('octokit', 'graphql.js');
    };

    console.log('TRY TO GET REPO');
    if (octoDAO) {
      getRepository();
    }
  }, [octoDAO?.graphqlAuth]);

  return (
    <Container>
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
    </Container>
  );
});
