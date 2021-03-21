import React, { useEffect } from 'react';
import { Reoverlay } from 'reoverlay';
import { API } from 'aws-amplify';

import SEO from '../../components/seo';
import AccountLayout from '../../components/layout/AccountLayout';
import { InfoSection } from '../../components/sections/AccountSection';
import Link from '../../components/Link';
import ConfirmModal from '../../components/boxes/ConfirmModalBox';

import useUser from '../../hooks/useUser';
import useToaster from '../../hooks/useToaster';
import { capitalize, clearUserStorage } from '../../utils';

/*
 * This page is what we're redirected to after a successful signup.
 * It's primarily the dashboard for the user, but it's also responsible
 * for sending a message to the extension containing the auth data.
 */
const Account = ({ location }) => {
  const toastsToPop = location.state?.toastsToPop;
  const user = useUser({ sendToExtension: true, isPublic: false });
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

  const cancelSubscription = async () => {
    // Reset user cache
    clearUserStorage();
    try {
      if (!user) throw new Error('User not logged in!');
      const cancelResponse = await API.post(
        'chummyRestApi',
        '/cancel-subscription',
        {
          body: {
            customer: user?.['custom:stripe_id']
          }
        }
      );
      console.log('Subscription canceled successfully', cancelResponse);
      createToast(
        'success',
        'Subscription Cancelled',
        "We're sad to see you go. Your subscription has been deactivated and a prorated refund will process in 3-5 days."
      );
    } catch (error) {
      console.warn('Error cancelling subscription.');
      createToast(
        'error',
        'Subscription Cancellation Error',
        'Something unexpected happened while trying to cancel your subscription. Please try again.'
      );
    }
  };

  const canUpgrade =
    !['professional', 'enterprise'].includes(user?.accountType) ||
    user?.isTrial === 'true';

  return (
    <AccountLayout title={<h2 className="mb-10">My Account</h2>}>
      <SEO title="Account - Dashboard" />
      <InfoSection
        title="Edition"
        leftText={
          user?.accountType
            ? `${capitalize(user?.accountType)}${
                user?.isTrial === 'true' ? ' (Trial)' : ''
              }`
            : null
        }
        right={
          <Link
            className="text-base font-light cursor-pointer select-none focus:outline-none sm:text-sm"
            to={canUpgrade ? '/checkout' : null}
            onClick={
              canUpgrade
                ? null
                : () => {
                    Reoverlay.showModal(ConfirmModal, {
                      confirmText:
                        'Are you sure you want to cancel your subscription?',
                      subText: (
                        <span>
                          You will lose your professional status{' '}
                          <span className="font-bold">immediately</span>,
                          however you won&apos;t lose any of your saved
                          bookmarks or preferences. A prorated amount less
                          Stripe&apos;s processing fees will be refunded to your
                          payment method in 3-5 business days.
                        </span>
                      ),
                      yesText: 'Yes, I want to cancel',
                      yesBgColor: 'bg-red-500',
                      noBgColor: 'bg-green-500',
                      noText: 'No',
                      onConfirm: cancelSubscription
                    });
                  }
            }
          >
            {canUpgrade ? (
              <span className="text-green-600">Upgrade</span>
            ) : (
              <span className="text-red-500">Cancel</span>
            )}
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
