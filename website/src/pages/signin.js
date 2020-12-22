import React from 'react';
import { Link } from 'gatsby';
import { Auth } from 'aws-amplify';

import Layout from '../components/layout';
import SEO from '../components/seo';

/*
 * This page is automatically opened by the extension during the sign in
 * flow. The sign in button is automatically clicked, and the page redirects
 * to Github's Auth 2.0 sign in form. The user then signs in, then the website
 * redirects to the account page of the signed in user. On load, this account page
 * will send a message to the extension.
 */
const SignIn = () => (
  <Layout>
    <SEO title="Sign In" />
    <h1>Sign In</h1>
    <button
      type="submit"
      onClick={() => Auth.federatedSignIn({ provider: 'Github' })}
    >
      Sign in with Github
    </button>

    <Link to="/">Go back to the homepage</Link>
  </Layout>
);

export default SignIn;
