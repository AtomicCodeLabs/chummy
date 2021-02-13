import React, { useEffect } from 'react';
import { Auth } from 'aws-amplify';

import SEO from '../../components/seo';
import AccountLayout from '../../components/layout/AccountLayout';

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
    <AccountLayout title={<h1 className="mb-10">My Account</h1>}>
      <SEO title="Account" />
      <div className="h-px bg-gray-300" />
      <div className="flex flex-row items-center justify-between py-6">
        <div className="flex flex-col">
          <h4 className="font-medium mt-0 mb-2.5 text-gray-700">Edition</h4>
          <div className="text-sm text-gray-700 sm:text-xs">Professional</div>
        </div>
        <div className="text-sm text-green-600 sm:text-xs">Change</div>
      </div>
      <div className="h-px bg-gray-300" />
      <div className="flex flex-row items-center justify-between py-6">
        <div className="flex flex-col">
          <h4 className="font-medium mt-0 mb-2.5 text-gray-700">
            Github Email
          </h4>
          <div className="text-sm text-gray-700 sm:text-xs">
            alexgkim205@gmail.com
          </div>
        </div>
      </div>
      <div className="h-px bg-gray-300" />
    </AccountLayout>
  );
};
export default Account;
