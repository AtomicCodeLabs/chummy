import { useEffect, useState } from 'react';
import { Auth, API } from 'aws-amplify';
import { navigate } from 'gatsby';

import { getUser } from '../graphql/queries';
import { onUpdateUser } from '../graphql/subscriptions';

const useUser = (props) => {
  const { sendToExtension = false, isPublic = true } = props || {};

  const [cachedCognitoUser, setCachedCognitoUser] = useState();
  const [account, setAccount] = useState();

  const getCurrentUser = async () => {
    let cognitoUser = cachedCognitoUser;

    if (!cognitoUser) {
      try {
        cognitoUser = await Auth.currentAuthenticatedUser();
      } catch (authErr) {
        // If not logged in, immediately redirect to home page
        // If it's on sign in page, let the user sign in, don't navigate away
        if (!isPublic) {
          navigate('/');
        }
        return null;
      }
    }

    console.log('GET COGNITO USER', cognitoUser);

    setCachedCognitoUser(cognitoUser);
    return cognitoUser;
  };

  // Send cognito user to extension if necessary
  useEffect(() => {
    if (sendToExtension) {
      const emitToContentScript = async (event) => {
        if (event.data.action === 'trigger-send-to-cs') {
          const cognitoUser = await getCurrentUser();
          console.log('Sending auth to content script', cognitoUser);
          window.postMessage(
            {
              action: 'auth-from-page',
              payload: {
                user: {
                  ...cognitoUser?.attributes,
                  owner: cognitoUser?.username,
                  idToken: cognitoUser?.signInUserSession?.idToken?.jwtToken,
                  accessToken:
                    cognitoUser?.signInUserSession?.accessToken?.jwtToken,
                  refreshToken:
                    cognitoUser?.signInUserSession?.refreshToken?.token
                }
              }
            },
            '*'
          );
        }
      };
      window.addEventListener('message', emitToContentScript);

      // send a trigger message to self to ensure it gets called at least once
      window.postMessage({ action: 'trigger-send-to-cs' }, '*');

      // cleanup
      return () => {
        window.removeEventListener('message', emitToContentScript);
      };
    }
  }, []);

  // Fetch user data from cache or ddb
  useEffect(() => {
    const fetchUser = async () => {
      const cognitoUser = await getCurrentUser();
      if (!cognitoUser) return;

      // If one doesn't already exist in storage, fetch user
      let cachedUser = JSON.parse(sessionStorage.getItem('currentUser'));
      if (!cachedUser) {
        // Combine cognito and ddb user information
        cachedUser = {
          ...(
            await API.graphql({
              query: getUser,
              authMode: 'AMAZON_COGNITO_USER_POOLS',
              variables: { id: cognitoUser?.attributes['custom:ddb_id'] }
            })
          )?.data?.getUser,
          ...cognitoUser?.attributes
        };
        sessionStorage.setItem('currentUser', JSON.stringify(cachedUser));
      }

      // set account
      setAccount(cachedUser);
    };
    fetchUser();
  }, []);

  // Subscribe to user updates
  useEffect(() => {
    let subscription;

    const getUserUpdates = async () => {
      // Subscribe to any changes
      subscription = API.graphql({
        query: onUpdateUser,
        authMode: 'AMAZON_COGNITO_USER_POOLS',
        variables: { owner: account.owner }
      }).subscribe({
        next: async ({ value }) => {
          const ddbUser = value?.data?.onUpdateUser;
          if (ddbUser) {
            const cognitoUser = await getCurrentUser();
            const cachedUser = {
              ...ddbUser,
              ...cognitoUser?.attributes
            };
            sessionStorage.setItem('currentUser', JSON.stringify(cachedUser));
            setAccount(cachedUser);
          }
        }
      });
    };

    if (account) {
      getUserUpdates();
    }

    return () => subscription?.unsubscribe();
  }, [account?.owner]);

  return account;
};

export default useUser;
