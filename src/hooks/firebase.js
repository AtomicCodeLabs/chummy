import { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '../config/firebase';
import { useUserStore } from './store';

export const useFirebase = () => {
  return useContext(FirebaseContext);
};

// export const useAuth = () => {
//   const firebase = useFirebase();
//   const userStore = useUserStore();
//   const [state, setState] = useState(() => {
//     const user = firebase.auth.currentUser;
//     return {
//       isPending: !user,
//       user
//     };
//   });

//   function onChange(user) {
//     const newState = { isPending: false, user };
//     userStore.setUser(newState);
//     setState(newState);
//   }

//   useEffect(() => {
//     // listen for auth state changes
//     const unsubscribe = firebase.auth.onAuthStateChanged(onChange);

//     // unsubscribe to the listener when unmounting
//     return () => unsubscribe();
//   }, []);

//   return state;
// };
