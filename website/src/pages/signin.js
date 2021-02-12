import React, { useEffect } from 'react';
import { Auth } from 'aws-amplify';

import Link from '../components/Link';
import Layout from '../components/layout';
import SEO from '../components/seo';

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
  useEffect(() => {
    // If `fromWebsite` doesn't exist in location state, automatically signin
    if (!location.state?.fromWebsite) {
      Auth.federatedSignIn({ provider: 'Github' });
    }
  }, []);

  return (
    <Layout>
      <SEO title="Sign In" />
      <h1>Sign In</h1>
      {/* <button
        type="submit"
        onClick={() => Auth.federatedSignIn({ provider: 'Github' })}
      >
        Sign in with Github
      </button> */}

      <Link to="/">Go back to the homepage</Link>
    </Layout>
  );
};

export default SignIn;
