import React from 'react';
import clsx from 'clsx';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

import browsers from '../../data/browsers';
import Link from '../Link';

const BrowserBox = ({ className, iconClassName = 'w-8 h-8 mx-1.5' }) => {
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
      # safari: file(relativePath: { eq: "browsers/safari.png" }) {
      #   ...iconImage
      # }
    }
  `);

  return (
    <div className={clsx('inline-flex', className)}>
      {browsers.map(({ name, url }) => (
        <Link
          to={url}
          className="transition-transform transform scale-100 hover:scale-110"
        >
          <Img
            key={name}
            fluid={data[name].childImageSharp.fluid}
            alt={name}
            className={clsx(iconClassName)}
          />
        </Link>
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
