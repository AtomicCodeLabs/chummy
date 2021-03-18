import React from 'react';

import Layout from '../components/layout';
import ConstrainedContainer from '../components/sections/ConstrainedContainer';
import SEO from '../components/seo';
import { Steps } from '../data/tutorial';

const TutorialPage = () => (
  <Layout
    innerMainClassName="justify-start items-center"
    navbarBgColor="bg-white"
    navbarSecondaryBgColor="bg-white"
    footerClassName="mt-60"
  >
    <SEO title="Checkout" />
    <ConstrainedContainer>
      <div className="text-center">
        <h1>
          Getting started is{' '}
          <span
            className="italic"
            style={{
              background:
                'linear-gradient(to top, #39FF14 50%, transparent 50%)'
            }}
          >
            easy
          </span>
          .
        </h1>
      </div>
      <div className="flex flex-col md:text-center">
        <Steps />
      </div>
    </ConstrainedContainer>
  </Layout>
);

export default TutorialPage;
