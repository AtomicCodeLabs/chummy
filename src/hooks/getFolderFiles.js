import { useState, useEffect } from 'react';
import useOctoDAO from './octokit';
import { useFileStore } from './store';

/* A hook to get all the files in a folder.
 * This will be called everytime a Folder component is mounted.
 */
export default (owner, repo, branch, treePath) => {
  const [nodes, setNodes] = useState([]);
  const octoDAO = useOctoDAO();
  const fileStore = useFileStore();

  useEffect(() => {
    const getRepositoryFolderNodes = async () => {
      // If the surface level nodes for this path already exist in the file store, don't make api request
      const foundNodes = fileStore.getNode(branch, treePath);
      if (foundNodes?.children) {
        setNodes(foundNodes.children);
      } else {
        const responseNodes = await octoDAO.getRepositoryNodes(
          owner,
          repo,
          branch,
          treePath
        );
        setNodes(responseNodes);
      }
    };
    if (octoDAO) {
      getRepositoryFolderNodes();
    }
  }, [octoDAO?.graphqlAuth, owner, repo, branch, treePath]);

  return nodes;
};
