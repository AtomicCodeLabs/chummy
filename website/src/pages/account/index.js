import React, { useEffect } from 'react';
import { Link } from 'gatsby';
import { Auth } from 'aws-amplify';

import Layout from '../../components/layout';
import SEO from '../../components/seo';

/*
 * This page is what we're redirected to after a successful signup.
 * It's primarily the dashboard for the user, but it's also responsible
 * for sending a message to the extension containing the auth data.
 */
const Account = () => {
  useEffect(() => {
    const emitToContentScript = (event) => {
      if (event.data.action === 'trigger-send-to-cs') {
        Auth.currentAuthenticatedUser()
          .then((user) => {
            console.log('Sending auth to content script', user);
            window.postMessage(
              {
                action: 'auth-from-page',
                payload: {
                  user: {
                    ...user.attributes,
                    idToken: user.signInUserSession.idToken.jwtToken,
                    accessToken: user.signInUserSession.accessToken.jwtToken,
                    refreshToken: user.signInUserSession.refreshToken.token
                  }
                }
              },
              '*'
            );
          })
          .catch((e) => {
            console.error(e);
          });
      }
    };

    console.log('added event listener');
    window.addEventListener('message', emitToContentScript);

    // send a trigger message to self to ensure it gets called at least once
    window.postMessage({ action: 'trigger-send-to-cs' }, '*');

    // cleanup
    return () => {
      window.removeEventListener('message', emitToContentScript);
    };
  }, []);

  return (
    <Layout>
      <SEO title="Sign In" />
      <h1>Account</h1>
      <button
        id="sign-in-github"
        type="submit"
        onClick={() => Auth.federatedSignIn({ provider: 'Github' })}
      >
        Sign in with Github
      </button>

      <Link to="/">Go back to the homepage</Link>
    </Layout>
  );
};
export default Account;
