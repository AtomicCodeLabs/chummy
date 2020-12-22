import React from 'react';
import Amplify from 'aws-amplify';
import { Link } from 'gatsby';

import awsExports from '../aws-exports';
import Layout from '../components/layout';
import Image from '../components/image';
import SEO from '../components/seo';

Amplify.configure(awsExports);

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/signin/">Go to signin</Link> <br />
    <Link to="/signout/">Go to signout</Link> <br />
    <Link to="/using-typescript/">Go to Using TypeScript</Link>
  </Layout>
);

export default IndexPage;
