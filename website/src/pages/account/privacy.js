import React from 'react';

import Link from '../../components/Link';
import Layout from '../../components/layout';
import SEO from '../../components/seo';

const IndexPage = () => (
  <Layout>
    <SEO title="Account Privacy" />
    <h1>Privacy</h1>
    <Link to="/">Go home</Link>
  </Layout>
);

export default IndexPage;
