import React from 'react';

import SEO from '../../components/seo';
import AccountLayout from '../../components/layout/AccountLayout';
import { InfoSection } from '../../components/sections/AccountSection';
import useUser from '../../hooks/useUser';
import { capitalize } from '../../utils';

/*
 * This page is what we're redirected to after a successful signup.
 * It's primarily the dashboard for the user, but it's also responsible
 * for sending a message to the extension containing the auth data.
 */
const Account = () => {
  const user = useUser(true);

  return (
    <AccountLayout title={<h2 className="mb-10">My Account</h2>}>
      <SEO title="Account" />
      <InfoSection
        title="Edition"
        leftText={capitalize(user?.accountType)}
        right={
          <button
            className="text-base font-light text-green-600 focus:outline-none sm:text-sm"
            type="button"
            onClick={() => {
              console.log('HELLO');
            }}
          >
            Change
          </button>
        }
        hasTopBorder
        hasBottomBorder
      />
      <InfoSection
        title="Github Email"
        leftText={user?.email}
        hasBottomBorder
      />
    </AccountLayout>
  );
};
export default Account;
