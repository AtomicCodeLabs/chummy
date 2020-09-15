import { useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useUserStore } from './store';
import { FirebaseContext } from '../config/firebase';

const useFirebaseDAO = () => {
  return useContext(FirebaseContext);
};

// Hook that just triggers current user fetch and returns a pending status that
// frontend can act on conditionally
export const checkCurrentUser = () => {
  const firebase = useFirebaseDAO();
  const history = useHistory();
  const location = useLocation();
  const { user, isPending, isLoggedIn } = useUserStore();

  // Check if user is signed in or not
  useEffect(() => {
    if (firebase && !isLoggedIn) {
      firebase.getCurrentUser();
    }
  }, [firebase]);

  // Redirect on userStore.user update
  // TODO: use chrome storage to persist user across different sessions
  useEffect(() => {
    console.log('user changed in checkCurrentUser', user, location);
    if (!isLoggedIn) {
      // If not on sign in page but not logged in.
      if (location.pathname !== '/account-sign-in')
        history.push('/account-sign-in');
    } else {
      // If coming from sign in page, go to tree
      // eslint-disable-next-line no-lonely-if
      if (location.pathname === '/account-sign-in') history.push('/');
    }
  }, [isLoggedIn]);

  return { isPending, user };
};

export default useFirebaseDAO;
