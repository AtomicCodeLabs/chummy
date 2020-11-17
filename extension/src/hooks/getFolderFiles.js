import { useState, useEffect } from 'react';
import useOctoDAO from './octokit';

/* A hook to get all the files in a folder.
 * This will be called everytime a Folder component is mounted.
 */
export default (repoInfo, open) => {
  const [nodes, setNodes] = useState([]);
  const octoDAO = useOctoDAO();

  useEffect(() => {
    const getRepositoryFolderNodes = async () => {
      const { owner, repo, branch, treePath } = repoInfo;
      const responseNodes = await octoDAO.getRepositoryNodes(
        owner,
        repo,
        branch,
        treePath
      );
      setNodes(responseNodes);
    };
    if (octoDAO && open) {
      getRepositoryFolderNodes();
    }
  }, [octoDAO?.graphqlAuth, repoInfo, open]);

  return nodes;
};
