import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useStaticQuery, graphql } from 'gatsby';

import initializeAmplify from '../../config/amplify';
import Navbar from './Navbar';
import Footer from './Footer';
import ConstrainedContainer from '../sections/ConstrainedContainer';

const Layout = ({
  children,
  SplashSection = <></>,
  splashSectionClassName = ''
}) => {
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
      <Navbar siteTitle={data.site.siteMetadata?.title || `Title`} />
      <div
        className={clsx(
          'flex flex-col bg-gradient-to-b from-green-200 to-green-50',
          splashSectionClassName
        )}
      >
        {SplashSection}
      </div>
      <ConstrainedContainer className="p-14 md:p-12 sm:p-6">
        <main>{children}</main>
      </ConstrainedContainer>
      <Footer />
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
