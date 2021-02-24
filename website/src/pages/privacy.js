import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import PrivacyCard from '../components/legal/PrivacyCard';

const PrivacyPage = () => (
  <Layout
    // isSimpleNavbar
    mainClassName="min-h-screen h-full bg-blue-50"
    innerMainClassName="justify-start items-center"
    navbarBgColor="bg-blue-50"
    navbarSecondaryBgColor="bg-white"
    footerClassName="w-full inset-x-0"
    fitFooter
  >
    <SEO title="Privacy" />
    <h2>Privacy Policy</h2>
    <p className="text-gray-500">Last updated: February 23, 2021</p>
    <PrivacyCard />
  </Layout>
);

export default PrivacyPage;
