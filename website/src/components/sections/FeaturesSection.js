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
      theme_more: file(relativePath: { eq: "features/theme_more.png" }) {
        ...featureImage
      }
      theme_vanilla_dark: file(
        relativePath: { eq: "features/theme_vanilla_dark.png" }
      ) {
        ...featureImage
      }
      theme_jane: file(relativePath: { eq: "features/theme_jane.png" }) {
        ...featureImage
      }
      theme_dracula: file(relativePath: { eq: "features/theme_dracula.png" }) {
        ...featureImage
      }
      theme_vanilla_light: file(
        relativePath: { eq: "features/theme_vanilla_light.png" }
      ) {
        ...featureImage
      }
      theme_monokai: file(relativePath: { eq: "features/theme_monokai.png" }) {
        ...featureImage
      }
      theme_material_light: file(
        relativePath: { eq: "features/theme_material_light.png" }
      ) {
        ...featureImage
      }
      session: file(relativePath: { eq: "features/session.png" }) {
        ...featureImage
      }
      scratchpad: file(relativePath: { eq: "safari.png" }) {
        ...featureImage
      }
      distraction: file(relativePath: { eq: "features/distraction_free.png" }) {
        ...featureImage
      }
      distractionExtension: file(
        relativePath: { eq: "features/distraction_free_extension.png" }
      ) {
        ...featureImage
      }
    }
  `);

  return (
    <>
      {[...features, ...(expanded ? extraFeatures : [])].map(
        ({
          leftImages,
          image2Grid,
          imageRight,
          features: _features,
          isColumn = false
        }) => (
          <FeatureBox
            key={`${_features[0].title}-${features.length}`}
            leftImages={
              leftImages &&
              leftImages.map((lImage) => (
                <Img
                  key={lImage}
                  fluid={data[lImage]?.childImageSharp?.fluid}
                  alt={_features[0].title}
                />
              ))
            }
            image2Grid={
              image2Grid &&
              image2Grid.map((image2) => (
                <Img
                  fluid={data[image2]?.childImageSharp?.fluid}
                  alt={_features[0].title}
                />
              ))
            }
            image2MaxWidth={
              image2Grid?.length
                ? parseInt(
                    data[image2Grid[0]]?.childImageSharp?.fluid?.sizes
                      ?.split(',')[1]
                      ?.match(/\d+/)[0],
                    10
                  ) - 100
                : 0
            }
            ImageRight={
              imageRight && (
                <Img
                  fluid={data[imageRight]?.childImageSharp?.fluid}
                  alt={_features[0].title}
                />
              )
            }
            isColumn={isColumn}
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
            <React.Fragment key={_features?.[0]?.title}>
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
            </React.Fragment>
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
          GitHub can be <span className="text-red-500">difficult</span> to
          navigate. <br />
          Chummy comes packed with features that make it{' '}
          <span className="text-green-500">easy</span>.
        </h2>
      }
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
