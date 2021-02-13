import React, { useEffect } from 'react';
import { Auth } from 'aws-amplify';

import Link from '../components/Link';
import Layout from '../components/layout';
import SEO from '../components/seo';
import AuthBox from '../components/boxes/AuthBox';
import Logo from '../components/Logo';

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
    <Layout
      hideFooter
      isSimpleNavbar
      mainClassName="h-full bg-gray-200 absolute inset-0"
    >
      <SEO title="Sign In" />
      <div className="flex items-center justify-center">
        <AuthBox Icon={<Logo />} title="Login">
          Hello
        </AuthBox>
      </div>
      <Link to="/">Go back to the homepage</Link>
    </Layout>
  );
};

export default SignIn;
