import React, { useEffect } from 'react';

import SEO from '../../components/seo';
import AccountLayout from '../../components/layout/AccountLayout';
import { InfoSection } from '../../components/sections/AccountSection';

import useUser from '../../hooks/useUser';
import useToaster from '../../hooks/useToaster';
import { capitalize } from '../../utils';
import Link from '../../components/Link';

/*
 * This page is what we're redirected to after a successful signup.
 * It's primarily the dashboard for the user, but it's also responsible
 * for sending a message to the extension containing the auth data.
 */
const Account = ({ location }) => {
  const toastsToPop = location.state?.toastsToPop;
  const user = useUser(true);
  const { createToast } = useToaster();

  // Toast the notifications that were enqueued into this page via location state
  useEffect(() => {
    if (toastsToPop?.[0]) {
      // Wait a sec so that user sees toast popping up
      setTimeout(() => {
        toastsToPop.forEach(({ type, title, message }) => {
          createToast(type, title, message);
        });
      }, 500);
    }
  }, [toastsToPop]);

  return (
    <AccountLayout title={<h2 className="mb-10">My Account</h2>}>
      <SEO title="Account" />
      <InfoSection
        title="Edition"
        leftText={capitalize(user?.accountType)}
        right={
          <Link
            className="text-base font-light text-green-600 focus:outline-none sm:text-sm"
            to="/checkout"
          >
            Change
          </Link>
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
