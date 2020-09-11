import { useContext } from 'react';
import { FirebaseContext } from '../config/firebase';

const useFirebaseDAO = () => {
  return useContext(FirebaseContext);
};

export default useFirebaseDAO;
