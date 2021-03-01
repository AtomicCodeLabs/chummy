import React, { useEffect } from 'react';
import clsx from 'clsx';

import initializeAmplify from '../../config/amplify';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({
  children,
  SplashSection = <></>,
  splashSectionClassName = '',
  isSimpleNavbar = false, // navbar is minimized and menu items are hidden
  hideNavbar = false,
  hideFooter = false,
  fitFooter = false,
  isSticky = true,
  isAccountPage = false,
  mainClassName = 'bg-white',
  innerMainClassName = '',
  footerClassName = '',
  navbarBgColor = 'bg-green-200',
  navbarSecondaryBgColor = 'bg-white'
}) => {
  // Initialize Amplify
  useEffect(() => {
    initializeAmplify();
  }, []);

  return (
    <>
      {!hideNavbar && (
        <Navbar
          bgColor={navbarBgColor}
          secondaryBgColor={navbarSecondaryBgColor}
          isSimpleNavbar={isSimpleNavbar}
          isSticky={isSticky}
          isAccountPage={isAccountPage}
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
      <main className={mainClassName}>
        <div
          className={clsx(
            'box-border flex flex-col mx-auto w-full h-full flex-nowrap',
            {
              'p-14 md:p-12 sm:p-6 max-w-6xl': !isSimpleNavbar,
              'p-4 md:p-2.5': isSimpleNavbar
            },
            innerMainClassName
          )}
        >
          {children}
        </div>
      </main>
      {!hideFooter && (
        <Footer className={footerClassName} fitFooter={fitFooter} />
      )}
    </>
  );
};

export default Layout;
