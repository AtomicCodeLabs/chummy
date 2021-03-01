import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

import ColumnSection from './ColumnSection';
import FeatureBox from '../boxes/FeatureBox';
import { features, extraFeatures } from '../../data/features';
import ResponsiveGridSection from './ReponsiveGridSection';
import ReasonBox from '../boxes/ReasonBox';

export const FeaturesContainer = ({ expanded = false }) => {
  const data = useStaticQuery(graphql`
    query {
      full: file(relativePath: { eq: "features/full.png" }) {
        ...featureImage
      }
      browser: file(relativePath: { eq: "features/browser.png" }) {
        ...featureImage
      }
      search: file(relativePath: { eq: "features/search.png" }) {
        ...featureImage
      }
      bookmark: file(relativePath: { eq: "features/bookmark.png" }) {
        ...featureImage
      }
      theme: file(relativePath: { eq: "features/theme.png" }) {
        ...featureImage
      }
      session: file(relativePath: { eq: "features/session.png" }) {
        ...featureImage
      }
      scratchpad: file(relativePath: { eq: "safari.png" }) {
        ...featureImage
      }
      cr: file(relativePath: { eq: "safari.png" }) {
        ...featureImage
      }
    }
  `);

  return (
    <>
      {[...features, ...(expanded ? extraFeatures : [])].map(
        ({ image, image2, features: _features }) => (
          <FeatureBox
            key={_features[0].title}
            Image={
              <Img
                fluid={data[image]?.childImageSharp?.fluid}
                alt={_features[0].title}
              />
            }
            Image2={
              image2 && (
                <Img
                  fluid={data[image2]?.childImageSharp?.fluid}
                  alt={_features[0].title}
                />
              )
            }
            className="-ml-7 sm:-ml-6 -mr-7 sm:-mr-6"
          >
            {_features &&
              _features.map(({ Icon, title, description }) => (
                <ReasonBox
                  key={title}
                  Icon={Icon}
                  title={title}
                  description={description}
                  className="-ml-7 md:-ml-6 -mr-7 md:-mr-6"
                />
              ))}
          </FeatureBox>
        )
      )}
      {!expanded && (
        <ResponsiveGridSection
          hasTitleSection={false}
          className="-mx-7 sm:-mx-6"
        >
          {extraFeatures.map(({ features: _features }) => (
            <>
              {_features &&
                _features.map(({ Icon, title, description }) => (
                  <ReasonBox
                    key={title}
                    Icon={Icon}
                    title={title}
                    description={description}
                    className="sm:mx-auto"
                  />
                ))}
            </>
          ))}
        </ResponsiveGridSection>
      )}
    </>
  );
};

const FeaturesSection = () => (
  <>
    <div className="relative invisible block" id="features">
      Features Section
    </div>
    <ColumnSection
      title={
        <h2 className="leading-tight">
          Github can be <span className="text-red-500">difficult</span> to
          navigate. <br />
          Chummy comes packed with features that make it{' '}
          <span className="text-green-500">easy</span>.
        </h2>
      }
      className="sm:mt-12"
    >
      <FeaturesContainer />
    </ColumnSection>
  </>
);

export default FeaturesSection;

export const featureImage = graphql`
  fragment featureImage on File {
    childImageSharp {
      fluid(maxWidth: 1000) {
        ...GatsbyImageSharpFluid
      }
    }
  }
`;
