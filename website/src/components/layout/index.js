/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';

import initializeAmplify from '../../config/amplify';
import Navbar from './navbar';
import SplashSection from '../sections/SplashSection';
import ConstrainedContainer from '../sections/ConstrainedContainer';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  // Initialize Amplify
  useEffect(() => {
    initializeAmplify();
  }, []);

  return (
    <>
      <SplashSection>
        <ConstrainedContainer>
          <Navbar siteTitle={data.site.siteMetadata?.title || `Title`} />
        </ConstrainedContainer>
      </SplashSection>
      <ConstrainedContainer>
        <main>{children}</main>
        <footer
          style={{
            marginTop: `2rem`
          }}
        >
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </footer>
      </ConstrainedContainer>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
