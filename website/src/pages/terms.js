import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import TermsCard from '../components/legal/TermsCard';

const TermsPage = () => (
  <Layout
    // isSimpleNavbar
    mainClassName="min-h-screen h-full bg-blue-50"
    innerMainClassName="justify-start items-center"
    navbarBgColor="bg-blue-50"
    navbarSecondaryBgColor="bg-white"
    footerClassName="w-full inset-x-0"
    fitFooter
  >
    <SEO title="Terms" description="Chummy's terms and conditions." />
    <h1 className="hidden">Terms & Conditions</h1>
    <h2>Terms & Conditions</h2>
    <p className="text-gray-500">Last updated: February 23, 2021</p>
    <TermsCard />
  </Layout>
);

export default TermsPage;
