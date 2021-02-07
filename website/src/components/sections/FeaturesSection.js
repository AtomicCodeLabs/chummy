import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

import ColumnSection from './ColumnSection';
import FeatureBox from '../boxes/FeatureBox';
import { features, extraFeatures } from '../../data/features';
import ResponsiveGridSection from './ReponsiveGridSection';
import ReasonBox from '../boxes/ReasonBox';

const FeaturesSection = () => {
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
      <ColumnSection
        title={
          <>
            Github can be difficult to navigate. <br />
            Chummy comes packed with features that make it easy.
          </>
        }
      >
        {features.map(({ image, image2, features: _features }) => (
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
                  style={{ height: '100%', width: '100%' }}
                  imgStyle={{ objectFit: 'contain', objectPosition: 'left' }}
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
                  className="-ml-7 sm:-ml-6 -mr-7 sm:-mr-6"
                />
              ))}
          </FeatureBox>
        ))}
        <ResponsiveGridSection
          hasTitleSection={false}
          className="-mx-7 sm:-mx-6"
        >
          {extraFeatures.map(({ Icon, title, description }) => (
            <ReasonBox
              key={title}
              Icon={Icon}
              title={title}
              description={description}
            />
          ))}
        </ResponsiveGridSection>
      </ColumnSection>
    </>
  );
};

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
