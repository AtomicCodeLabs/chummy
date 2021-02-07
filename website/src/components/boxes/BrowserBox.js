import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

const browsers = [
  { name: 'chrome' },
  { name: 'firefox' },
  { name: 'edge' },
  { name: 'opera' },
  { name: 'safari' }
];

const BrowserBox = () => {
  const data = useStaticQuery(graphql`
    query {
      chrome: file(relativePath: { eq: "browsers/chrome.png" }) {
        ...iconImage
      }
      firefox: file(relativePath: { eq: "browsers/firefox.png" }) {
        ...iconImage
      }
      edge: file(relativePath: { eq: "browsers/edge.png" }) {
        ...iconImage
      }
      opera: file(relativePath: { eq: "browsers/opera.png" }) {
        ...iconImage
      }
      safari: file(relativePath: { eq: "browsers/safari.png" }) {
        ...iconImage
      }
    }
  `);

  return (
    <div className="inline-flex">
      {browsers.map(({ name }) => (
        <Img
          key={name}
          fluid={data[name].childImageSharp.fluid}
          alt={name}
          className="w-8 h-8 mr-3"
        />
      ))}
    </div>
  );
};

export default BrowserBox;

export const iconImage = graphql`
  fragment iconImage on File {
    childImageSharp {
      fluid(maxWidth: 100) {
        ...GatsbyImageSharpFluid
      }
    }
  }
`;
