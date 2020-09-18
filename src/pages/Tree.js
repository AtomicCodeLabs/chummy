import React from 'react';
import styled from 'styled-components';
import { checkCurrentUser } from '../hooks/firebase';
import getFolderFiles from '../hooks/getFolderFiles';
import Node from '../components/Node';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export default () => {
  checkCurrentUser();
  const nodes = getFolderFiles('alexkim205', 'WORKWITH', 'HEAD', '');

  return (
    <Container>
      {nodes &&
        nodes.map((n) => (
          <Node
            owner="alexkim205"
            repo="WORKWITH"
            branch="HEAD"
            data={n}
            key={n.oid}
          />
        ))}
    </Container>
  );
};
