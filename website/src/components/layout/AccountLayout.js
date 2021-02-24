import React from 'react';
import clsx from 'clsx';
import { navigate } from 'gatsby';
import { Auth } from 'aws-amplify';
import { useLocation } from '@reach/router';
import { ModalContainer, Reoverlay } from 'reoverlay';

import { clearUserStorage, matchRoutes } from '../../utils';
import { privateRoutes } from './routes';

import Layout from './index';
import Link from '../Link';
import ConfirmModalBox from '../boxes/ConfirmModalBox';

const AccountLayout = ({ className, title, children }) => {
  const { pathname } = useLocation();

  return (
    <>
      <Layout
        isSimpleNavbar
        mainClassName="min-h-screen	h-full bg-white"
        innerMainClassName="justify-start items-center"
        navbarSecondaryBgColor="bg-white"
        footerClassName="mt-32 w-full inset-x-0"
        isAccountPage
        fitFooter
      >
        <div
          className={clsx(
            'flex flex-row w-full max-w-6xl py-8 md:flex-col',
            className
          )}
        >
          <div className="flex flex-col flex-wrap self-start justify-center px-6 pt-28 md:pt-0 md:w-full md:flex-row">
            {privateRoutes.map(({ name, pathname: rPathname }) => {
              const isSamePage = matchRoutes(rPathname, pathname);
              return (
                <Link
                  key={name}
                  to={rPathname}
                  className={clsx(
                    'text-gray-500 px-6 mx-1 py-2.5 my-1 rounded-full xs:w-full xs:text-center',
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
            <button
              type="button"
              onClick={() => {
                Reoverlay.showModal(ConfirmModalBox, {
                  confirmText: 'Are you sure you want to log out?',
                  yesText: 'Yes, I want to log out',
                  onConfirm: () => {
                    // On confirm
                    Auth.signOut();
                    clearUserStorage();
                    navigate('/');
                  }
                });
              }}
              className={clsx(
                'text-gray-500 text-left focus:outline-none px-6 mx-1 py-2.5 my-1 rounded-full xs:w-full xs:text-center',
                'transition-colors duration-100 bg-white',
                'font-light hover:bg-gray-200'
              )}
            >
              Logout
            </button>
          </div>
          <div className="flex-1 md:w-full">
            <div className="px-10 md:px-5">
              {title}
              {children}
            </div>
          </div>
        </div>
      </Layout>
      <ModalContainer />
    </>
  );
};

export default AccountLayout;
