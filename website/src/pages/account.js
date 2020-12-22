import React from 'react';
import { Link } from 'gatsby';
import { Auth } from 'aws-amplify';

// import useBrowser from '../hooks/browser';
import Layout from '../components/layout';
import SEO from '../components/seo';

/*
 * This page is what we're redirected to after a successful signup.
 * It's primarily the dashboard for the user, but it's also responsible
 * for sending a message to the extension containing the auth data.
 */
const Account = () => 
  // const { browser } = useBrowser();
  // const signout = () => {};

  // useEffect(() => {
  // brow
  // }, []);

  // const getUser = () => {
  //   return Auth.currentAuthenticatedUser()
  //     .then((userData) => userData)
  //     .catch(() => console.log('Not signed in'));
  // };

   (
    <Layout>
      <SEO title="Sign In" />
      <h1>Account</h1>
      <button
        type="submit"
        onClick={() => Auth.federatedSignIn({ provider: 'Github' })}
      >
        Sign in with Github
      </button>

      <Link to="/">Go back to the homepage</Link>
    </Layout>
  )
;

export default Account;
