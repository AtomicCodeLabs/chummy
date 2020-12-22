import React from 'react';
import { Link } from 'gatsby';
import { Auth } from 'aws-amplify';

import Layout from '../../../components/layout';
import SEO from '../../../components/seo';

const Redirect = () => (
  <Layout>
    <SEO title="Sign In Redirect" />
    <h1>Sign In Redirect</h1>
    <button
      type="submit"
      onClick={() => Auth.federatedSignIn({ provider: 'Github' })}
    >
      Open Github
    </button>

    <Link to="/">Go back to the homepage</Link>
  </Layout>
);

export default Redirect;
