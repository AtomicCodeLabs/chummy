import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { checkCurrentUser } from '../hooks/firebase';
import useOctoDAO from '../hooks/octokit';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default observer(() => {
  checkCurrentUser();
  const [nodes, setNodes] = useState();
  const octoDAO = useOctoDAO();

  useEffect(() => {
    const getRepositoryRootNodes = async () => {
      const responseNodes = await octoDAO.getRepositoryRootNodes(
        'alexkim205',
        'WORKWITH'
      );
      setNodes(responseNodes);
    };

    if (octoDAO) {
      getRepositoryRootNodes();
    }
  }, [octoDAO?.graphqlAuth]);

  return (
    <Container>
      {nodes &&
        nodes.map((n) => (
          <div key={n.oid}>
            {n.name}
            <br />
          </div>
        ))}
    </Container>
  );
});
