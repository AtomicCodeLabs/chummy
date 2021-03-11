import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import Node from '../../components/Node/TreeOrBlobNode';
import useOctoDAO from '../../hooks/octokit';
import { useFileStore } from '../../hooks/store';

const FilesSection = observer(() => {
  const octoDAO = useOctoDAO();
  const { currentBranch } = useFileStore();
  const [nodes, setNodes] = useState([]);

  // Get current repository's files
  useEffect(() => {
    const getBranchNodes = async () => {
      if (!currentBranch) {
        // If null (on tab that's not github)
        return;
      }
      const responseNodes = await octoDAO.getRepositoryNodes(
        currentBranch?.repo?.owner,
        currentBranch?.repo?.name,
        currentBranch,
        ''
      );
      setNodes(responseNodes);
    };
    if (octoDAO) {
      getBranchNodes();
    }
  }, [
    octoDAO?.graphqlAuth,
    currentBranch?.repo?.owner,
    currentBranch?.repo?.name,
    currentBranch?.name
  ]);

  return (
    <>
      {currentBranch &&
        nodes &&
        nodes.map((n) => (
          <Node
            owner={currentBranch.repo.owner}
            repo={currentBranch.repo.name}
            branch={currentBranch}
            data={n}
            key={n.path}
          />
        ))}
    </>
  );
});

export default FilesSection;
