/* eslint-disable no-nested-ternary */
import React, { cloneElement, useState } from 'react';
import { API } from 'aws-amplify';
import clsx from 'clsx';
import { CgCheck, CgCheckO } from 'react-icons/cg';

import ActionButton from '../buttons/ActionButton';

import getStripe from '../../config/stripe';
import { capitalize, clearUserStorage } from '../../utils';

const EditionBox = ({
  title,
  description,
  price,
  isMonthly,
  features,
  Icon,
  unit,
  className,
  customerId,
  userAccountType = 'community',
  isTrial = false,
  isFeatured = false
}) => {
  const isCommunity = title === 'Community';
  const isLoggedIn = !!customerId;
  const isPremium = ['professional', 'enterprise'].includes(userAccountType);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [quantity, setQuantity] = useState(1);

  const redirectToCheckout = async (
    event,
    tier = 'professional',
    type = 'monthly'
  ) => {
    event.preventDefault();
    setLoading(true);

    // Clear storage to reset current user cache
    clearUserStorage();

    // Get session
    try {
      const session = await API.post('chummyRestApi', '/session', {
        body: {
          customer: customerId,
          tier,
          type,
          quantity,
          success_url: new URL(
            'account/checkout/success',
            process.env.WEBSITE_BASE_URL
          ).toString(),
          cancel_url: new URL(
            'account/checkout/error',
            process.env.WEBSITE_BASE_URL
          ).toString()
        }
      });
      console.log('SESSION', session);

      const stripe = await getStripe();
      const checkoutResponse = await stripe.redirectToCheckout({
        sessionId: session?.id
      });
      console.log('Checkout response', checkoutResponse);
    } catch (error) {
      console.warn('Something unexpected occurred during checkout.', error);
    }

    setLoading(false);
  };

  const renderButton = () => {
    // If logged in, community button redirects to extension store, and professional/enterprise to stripe checkout
    // If not logged in, all buttons redirect to signin page

    if (title === 'Community') {
      return (
        <ActionButton
          to={
            isPremium
              ? null
              : 'https://chrome.google.com/webstore/category/extensions'
          }
          className="my-auto"
          isLoading={loading}
          disabled={['professional', 'enterprise'].includes(userAccountType)}
        >
          {isPremium
            ? `Already subscribed to ${capitalize(userAccountType)}${
                isTrial ? ' Trial' : ''
              }`
            : 'Download free'}
        </ActionButton>
      );
    }
    if (title === 'Professional') {
      return (
        <>
          {userAccountType === 'professional' && !isTrial ? (
            <div className="flex flex-col items-center justify-center">
              <CgCheckO className="w-8 h-8 mb-3 text-green-500 fill-current sm:w-6 sm:h-6 sm:mb-2" />
              <span className="font-mono text-base font-bold text-green-600 sm:text-sm">
                You&apos;re already subscribed!
              </span>
            </div>
          ) : (
            <ActionButton
              onClick={
                isLoggedIn && (!isPremium || isTrial)
                  ? (e) =>
                      redirectToCheckout(
                        e,
                        'professional',
                        isMonthly ? 'monthly' : 'yearly'
                      )
                  : null
              }
              to={!isLoggedIn ? '/signin' : null}
              className="my-auto"
              isLoading={loading}
              disabled={userAccountType === 'enterprise'}
            >
              {isLoggedIn
                ? userAccountType === 'enterprise'
                  ? `Already subscribed to ${capitalize(userAccountType)}`
                  : 'Upgrade Now'
                : 'Start 14-day trial'}
            </ActionButton>
          )}
        </>
      );
    }
    if (title === 'Enterprise') {
      return (
        <>
          {userAccountType === 'enterprise' ? (
            <div className="flex flex-col items-center justify-center">
              <CgCheckO className="w-8 h-8 mb-3 text-green-500 fill-current sm:w-6 sm:h-6 sm:mb-2" />
              <span className="font-mono text-base font-bold text-green-600 sm:text-sm">
                You&apos;re already subscribed!
              </span>
            </div>
          ) : (
            <ActionButton
              // onClick={
              //   isLoggedIn
              //     ? (e) =>
              //         redirectToCheckout(
              //           e,
              //           'enterprise',
              //           isMonthly ? 'monthly' : 'yearly'
              //         )
              //     : null
              // }
              to={!isLoggedIn ? '/signin' : 'mailto: hello@atomiccode.io'}
              className="my-auto"
              isLoading={loading}
            >
              {isLoggedIn ? 'Contact Sales' : 'Start 14-day trial'}
            </ActionButton>
          )}
        </>
      );
    }
  };

  return (
    <div
      className={clsx(
        'rounded-lg bg-gray-100 cursor-text sm:w-4/5 sm:items-center overflow-hidden',
        'text-center',
        {
          'shadow-lg': isFeatured,
          'border-2 border-gray-200': !isFeatured
        },
        className
      )}
      style={isFeatured ? { borderTop: '12px solid #34D399' } : {}}
    >
      <div
        className={clsx('flex flex-col px-7 pb-7 sm:py-6 sm:px-8 xs:px-6', {
          'pt-7': isFeatured,
          'pt-10': !isFeatured
        })}
      >
        <div className="self-center w-20 h-20 mt-10 mb-8 md:h-16 md:w-16 sm:h-14 sm:w-14">
          {cloneElement(Icon, { className: 'h-full w-full' })}
        </div>
        <h4 className="font-mono uppercase">{title}</h4>
        <p className="h-12 text-base text-gray-500 md:h-auto">{description}</p>
        <div className="flex flex-col items-center justify-start h-24 mt-8 text-center md:h-20">
          <div className="inline-flex flex-row justify-center text-gray-500">
            {isCommunity ? (
              <span className="text-5xl text-gray-900 md:text-4xl sm:text-3xl">
                Free
              </span>
            ) : (
              <>
                <div className="w-4">
                  <span className="text-xl text-gray-500 md:text-lg sm:text-md">
                    $
                  </span>
                </div>
                <span className="text-gray-900 text-7xl md:text-6xl sm:text-5xl">
                  {price}
                </span>
                <div className="flex items-end w-4">
                  <span className="text-xl text-gray-500 md:text-lg sm:text-md">
                    {unit}
                  </span>
                </div>
              </>
            )}
          </div>
          {!isCommunity && !isMonthly && (
            <span className="text-base text-gray-500 md:text-sm">
              billed annually
            </span>
          )}
        </div>
        <div className="flex h-20 mx-auto my-3 md:my-0 sm:-my-2">
          {renderButton()}
        </div>
      </div>
      {/* Features */}
      <div className="flex flex-col w-full h-full p-4 text-left bg-white border-t-2 border-gray-200">
        {features &&
          features.map((feature, i) => (
            <div
              key={feature}
              className={clsx('flex flex-row items-start p-1', {
                'font-bold mt-3 mb-2': i === 0
              })}
            >
              {i !== 0 && (
                <CgCheck className="w-6 h-6 text-green-500 fill-current" />
              )}{' '}
              <div className="flex-1 text-base">{feature}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EditionBox;
