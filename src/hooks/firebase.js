import { useContext } from 'react';
import { FirebaseContext } from '../config/firebase';

const useFirebase = () => {
  return useContext(FirebaseContext);
};

export default useFirebase;
