import React, { cloneElement } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';
import { CgArrowRight } from 'react-icons/cg';

import Layout from '../components/layout';
import SEO from '../components/seo';
import ColumnSection from '../components/sections/ColumnSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import ReasonsSection from '../components/sections/ReasonsSection';
import BrowserBox from '../components/boxes/BrowserBox';
import ConstrainedContainer from '../components/sections/ConstrainedContainer';
import EditionsSection from '../components/sections/EditionsSection';
import SigninButton from '../components/buttons/SigninButton';

const IndexPage = () => {
  const data = useStaticQuery(graphql`
    query {
      before: file(relativePath: { eq: "features/before_mockup.png" }) {
        childImageSharp {
          fluid(maxWidth: 1000, quality: 90) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      after: file(relativePath: { eq: "features/after_mockup.png" }) {
        childImageSharp {
          fluid(maxWidth: 1000, quality: 90) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  return (
    <Layout
      footerClassName="mt-60"
      mainClassName="overflow-hidden"
      SplashSection={
        <>
          <ConstrainedContainer className="pt-8 md:mt-0 px-14 pb-14 md:px-12 md:pb-12 md:pt-6 sm:px-6 sm:pb-6 sm:pt-6">
            <ColumnSection
              title={
                <h1>
                  Use Github,{' '}
                  <span
                    className="italic"
                    style={{
                      background:
                        'linear-gradient(to top, #39FF14 50%, transparent 50%)'
                    }}
                  >
                    Productively
                  </span>
                  .
                </h1>
              }
              colWidth={9}
              titleClassName="my-0 mb-10 md:mb-5"
              isCentered
            >
              <p className="text-lg md:text-base sm:text-sm">
                Chummy is a browser extension that helps you stay focused on
                what matters to you, whether that’s developing, contributing,
                browsing, or stargazing a bunch of random repositories.
              </p>
              <div className="inline-flex flex-col justify-center md:flex-col">
                <div className="flex h-20 mx-auto">
                  <SigninButton
                    className="my-auto"
                    signedInText="Get Started for Free"
                    signedOutText="Get Started for Free"
                  />
                </div>
                <BrowserBox className="mx-auto mb-4" />
                <div className="mx-auto mb-4 text-xs text-gray-500 sm:text-xxs md:mx-0">
                  Installs the free Community Edition. <br />
                  First time user? Get a free 14-day Professional trial on us!
                </div>
              </div>
            </ColumnSection>
            <div className="flex flex-row items-center justify-center md:flex-col">
              <div className="w-7/12 md:w-full">
                <Img
                  fluid={data.before?.childImageSharp?.fluid}
                  alt="Cluttered windows"
                />
              </div>
              <div className="w-1/12 md:w-1/6">
                {cloneElement(<CgArrowRight />, {
                  className:
                    'transform rotate-0 h-full w-full md:rotate-90 fill-current text-gray-500'
                })}
              </div>
              <div className="w-4/12 md:w-3/5">
                <Img
                  fluid={data.after?.childImageSharp?.fluid}
                  alt="Chummy window"
                />
              </div>
            </div>
          </ConstrainedContainer>
          <svg
            className="text-white fill-current"
            x="0"
            y="0"
            viewBox="0 0 1420 106"
            preserveAspectRatio="none"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0C558.348 61.8524 869.206 60.7752 1420 0V106H0V0Z" />
          </svg>
        </>
      }
      splashSectionClassName="-mb-8 md:-mb-4"
    >
      <SEO title="Chummy" description="Browse Github better" />
      <FeaturesSection />
      <ReasonsSection />
      <EditionsSection />
    </Layout>
  );
};

export default IndexPage;
