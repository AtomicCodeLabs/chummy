import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import { FeaturesContainer } from '../components/sections/FeaturesSection';

const FeaturesPage = () => (
  <Layout
    mainClassName="overflow-hidden"
    innerMainClassName="justify-start items-center"
    navbarBgColor="bg-white"
    navbarSecondaryBgColor="bg-white"
    footerClassName="mt-60"
  >
    <SEO
      title="Features"
      description="Wondering what features Chummy has to offer? Explore the growing list of features that Chummy brings to your GitHub experience."
    />
    <div className="text-center">
      <h1>
        <span
          className="italic"
          style={{
            background: 'linear-gradient(to top, #39FF14 50%, transparent 50%)'
          }}
        >
          Features
        </span>{' '}
        abound!
      </h1>
      <p className="text-lg md:text-base sm:text-sm">
        Explore the growing list of features Chummy has to offer.
      </p>
    </div>
    <div className="mt-20">
      <FeaturesContainer />
    </div>
  </Layout>
);

export default FeaturesPage;
