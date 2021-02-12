import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useStaticQuery, graphql } from 'gatsby';

import initializeAmplify from '../../config/amplify';
import Navbar from './Navbar';
import Footer from './Footer';
import ConstrainedContainer from '../sections/ConstrainedContainer';

const Layout = ({
  children,
  SplashSection = <></>,
  splashSectionClassName = '',
  isSimpleNavbar = false, // navbar is minimized and menu items are hidden
  hideNavbar = false,
  hideFooter = false,
  mainClassName = 'bg-white'
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
      {!hideNavbar && (
        <Navbar
          isSimpleNavbar={isSimpleNavbar}
          siteTitle={data.site.siteMetadata?.title || `Title`}
        />
      )}
      {SplashSection && (
        <div
          className={clsx(
            'flex flex-col bg-gradient-to-b from-green-200 to-green-50',
            splashSectionClassName
          )}
        >
          {SplashSection}
        </div>
      )}
      <ConstrainedContainer
        className={clsx('p-14 md:p-12 sm:p-6', mainClassName)}
      >
        <main>{children}</main>
      </ConstrainedContainer>
      {!hideFooter && <Footer />}
    </>
  );
};

export default Layout;
