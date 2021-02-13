import React from 'react';
import clsx from 'clsx';
import { useLocation } from '@reach/router';

import { matchRoutes } from '../../utils';
import { privateRoutes } from './routes';
import Layout from './index';
import Link from '../Link';

const AccountLayout = ({ className, title, children }) => {
  const { pathname } = useLocation();

  console.log('PATHNAME', pathname);

  return (
    <Layout
      isSimpleNavbar
      isSticky={false}
      mainClassName="h-full bg-white"
      innerMainClassName="justify-center items-center"
      navbarSecondaryBgColor="bg-gray-200"
      footerClassName="absolute w-full inset-x-0"
      fitFooter
    >
      <div
        className={clsx(
          'flex flex-row w-full max-w-6xl py-8 md:flex-col',
          className
        )}
      >
        <div className="flex flex-col flex-wrap justify-center px-10 pt-28 md:pt-0 md:w-full md:flex-row">
          {privateRoutes.map(({ name, pathname: rPathname }) => {
            const isSamePage = matchRoutes(rPathname, pathname);
            return (
              <Link
                key={name}
                to={rPathname}
                className={clsx(
                  'text-gray-500 px-9 mx-1 py-2.5 my-1 rounded-full xs:w-full xs:text-center',
                  'transition-colors duration-100 bg-white',
                  {
                    'font-normal bg-gray-200 hover:bg-gray-300': isSamePage,
                    'font-light hover:bg-gray-200': !isSamePage
                  }
                )}
              >
                {name}
              </Link>
            );
          })}
        </div>
        <div className="flex-1 md:w-full">
          <div className="px-10 md:px-5">
            {title}
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AccountLayout;
