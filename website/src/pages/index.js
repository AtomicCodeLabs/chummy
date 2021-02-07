import React from 'react';

import Layout from '../components/layout';
import SEO from '../components/seo';
import ColumnSection from '../components/sections/ColumnSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import ReasonsSection from '../components/sections/ReasonsSection';
import ActionButton from '../components/buttons/ActionButton';
import BrowserBox from '../components/boxes/BrowserBox';

const IndexPage = () => (
  <Layout isHomePage>
    <SEO title="Home" />
    <ColumnSection
      title={
        <>
          Use Github, <span className="italic">Productively</span>.
        </>
      }
      colWidth={8}
    >
      <p>
        Chummy is a browser extension that helps you stay focused on what
        matters to you, whether that’s developing, contributing, browsing, or
        stargazing a bunch of random repositories.
      </p>
      <div className="inline-flex md:flex-col">
        <ActionButton to="signin/" className="mx-0 my-4 mb-auto mr-auto">
          Get Started for Free
        </ActionButton>
        <div className="flex-1 mx-4 my-4 text-xs text-gray-500 sm:text-xxs md:mx-0">
          Installs the Community Edition. <br />
          First time user? Get a 30-day free Professional trial on us!
        </div>
      </div>
      <BrowserBox />
    </ColumnSection>
    <FeaturesSection />
    <ReasonsSection />
  </Layout>
);

export default IndexPage;
