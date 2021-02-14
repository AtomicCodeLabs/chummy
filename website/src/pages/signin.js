import React, { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

import Layout from '../components/layout';
import SEO from '../components/seo';
import AuthBox from '../components/boxes/AuthBox';
import Logo from '../components/Logo';
import ActionButton from '../components/buttons/ActionButton';
import Spinner from '../components/spinners/Spinner';

/*
 * Two states of this page exists:
 *    1. Page is opened by extension sign in button and auto clicks sign in
 *    2. Page is opened by website sign in button
 *
 * This page is automatically opened by the extension during the sign in
 * flow. The sign in button is automatically clicked, and the page redirects
 * to Github's Auth 2.0 sign in form. The user then signs in, then the website
 * redirects to the account page of the signed in user. On load, this account page
 * will send a message to the extension.
 */
const SignIn = ({ location }) => {
  const [error, setError] = useState();
  const fromExtension = !location.state?.fromWebsite;

  const signIn = async () => {
    try {
      await Auth.federatedSignIn({ provider: 'Github' });
    } catch (e) {
      console.error('Error', e);
      setError(e);
    }
  };

  useEffect(() => {
    // If `fromWebsite` doesn't exist in location state, automatically signin
    if (fromExtension) {
      signIn();
    }
  }, []);

  return (
    <Layout
      hideFooter
      isSimpleNavbar
      mainClassName="h-full bg-gray-200 absolute inset-0"
      innerMainClassName="justify-center items-center"
    >
      <SEO title="Sign In" />
      <div className="flex items-center justify-center bg-white rounded-lg shadow-lg">
        {fromExtension ? (
          <AuthBox
            Icon={<Spinner className="bg-green-500" />}
            title={<h3>One moment please.</h3>}
            className="flex flex-col items-center justify-center w-84 md:w-full"
          >
            <div className="text-base text-gray-500 md:text-sm sm:text-xs">
              Redirecting to Github...
            </div>
          </AuthBox>
        ) : (
          <AuthBox
            Icon={<Logo noText logoClassName="w-full" to="/signin" />}
            title={<h2>Login</h2>}
            className="flex flex-col items-center justify-center w-80 md:w-full"
          >
            <div className="flex mx-auto h-14 md:h-10 sm:h-10">
              <ActionButton onClick={signIn} className="my-auto">
                Sign in with Github
              </ActionButton>
            </div>
            {error && (
              <div className="mt-2 mb-4 text-xs leading-5 text-center text-red-500 sm:mb-1 sm:text-3xs">
                There was an error signing in. Please try again.
              </div>
            )}
            <div className="mt-2 mb-4 text-xs leading-5 text-center text-gray-500 sm:mb-1 sm:text-3xs">
              First time{' '}
              <span className="font-bold text-green-500">Chummy</span> user?
              <br /> Sign in to start your 14-day free trial.
            </div>
          </AuthBox>
        )}
      </div>
    </Layout>
  );
};

export default SignIn;
