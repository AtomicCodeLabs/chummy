import React from 'react';
import clsx from 'clsx';
import { useStaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

import Link from './Link';

export default ({
  isResponsive = false,
  isDarkBg = false,
  hideIcon = false,
  noText = false,
  collapse = true, // responsive collapse
  isSimpleNavbar = false,
  to = '/',
  className,
  logoClassName
}) => {
  const data = useStaticQuery(graphql`
    query {
      lightIcon: file(relativePath: { eq: "chummy512_transparent.png" }) {
        childImageSharp {
          fluid(maxHeight: 512) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      darkIcon: file(relativePath: { eq: "chummy512_transparent_white.png" }) {
        childImageSharp {
          fluid(maxHeight: 512) {
            ...GatsbyImageSharpFluid
          }
        }
      }
    }
  `);

  return (
    <Link
      className={clsx('text-current	flex md:h-auto items-center', className)}
      to={to}
    >
      <Img
        className={clsx(logoClassName, { hidden: hideIcon })}
        fluid={
          data[isDarkBg ? 'darkIcon' : 'lightIcon']?.childImageSharp?.fluid
        }
        alt="Feature Image"
        imgStyle={{ objectFit: 'contain' }}
      />
      {!noText && (
        <div
          className={clsx('flex flex-col md:flex', {
            'items-center md:flex-row': isResponsive,
            'md-lg:hidden': isResponsive && !isSimpleNavbar && collapse, // don't hide text if simple navbar
            'items-start': !isResponsive
          })}
        >
          <div
            className={clsx('text-2xl font-bold md:text-xl', {
              'text-gray-100': isDarkBg
            })}
          >
            Chummy
          </div>
          <div
            className={clsx(
              'font-mono text-xs md:text-xxs',
              'overflow-hidden whitespace-nowrap overflow-ellipsis',
              {
                'text-gray-600': !isDarkBg,
                'text-gray-400': isDarkBg,
                'md:ml-1.5': isResponsive
              }
            )}
          >
            by Atomic Code
          </div>
        </div>
      )}
    </Link>
  );
};
