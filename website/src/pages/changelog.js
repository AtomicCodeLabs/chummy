import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';

const ChangelogPage = () => (
  <Layout
    // isSimpleNavbar
    mainClassName="min-h-screen h-full bg-blue-50"
    innerMainClassName="justify-start items-center"
    navbarBgColor="bg-blue-50"
    navbarSecondaryBgColor="bg-white"
    footerClassName="w-full inset-x-0"
    fitFooter
  >
    <SEO title="Changelog" />
    <h2>Changelog</h2>
  </Layout>
);

export default ChangelogPage;
