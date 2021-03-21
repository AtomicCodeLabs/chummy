import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { EditionsContainer } from '../components/sections/EditionsSection';

const CheckoutPage = () => (
  <Layout
    innerMainClassName="justify-start items-center"
    navbarBgColor="bg-white"
    navbarSecondaryBgColor="bg-white"
    footerClassName="mt-60"
  >
    <SEO
      title="Checkout"
      description="It's free to get started with Chummy, no credit card required. Chummy comes in three editions: Community, Professional, and Enterprise. Discover which edition works best for you!"
    />
    <div className="text-center">
      <h1>
        <span
          className="italic"
          style={{
            background: 'linear-gradient(to top, #39FF14 50%, transparent 50%)'
          }}
        >
          Pricing
        </span>{' '}
        that&apos;s flexible.
      </h1>
      <p className="text-lg md:text-base sm:text-sm">
        Pick the plan that&apos;s right for you.
      </p>
    </div>
    <div className="mt-8">
      <EditionsContainer />
    </div>
    {/* <FAQSection /> */}
  </Layout>
);

export default CheckoutPage;
