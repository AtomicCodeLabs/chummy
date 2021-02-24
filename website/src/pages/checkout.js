import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { EditionsContainer } from '../components/sections/EditionsSection';
import FAQSection from '../components/sections/FAQSection';

const CheckoutPage = () => (
  <Layout
    innerMainClassName="justify-start items-center"
    navbarBgColor="bg-white"
    navbarSecondaryBgColor="bg-white"
    footerClassName="mt-60"
  >
    <SEO title="Checkout" />
    <h2>Pick the plan that&apos;s right for you.</h2>
    <p>Start your 14-day trial. No credit card required.</p>
    <div>
      <EditionsContainer />
    </div>
    <FAQSection />
  </Layout>
);

export default CheckoutPage;
