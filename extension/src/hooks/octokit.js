import { useContext } from 'react';
import { OctoContext } from '../config/octokit';

const useOctoDAO = () => {
  return useContext(OctoContext);
};

export default useOctoDAO;
