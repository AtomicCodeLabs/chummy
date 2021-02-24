import React from 'react';
import { API } from 'aws-amplify';
import { navigate } from 'gatsby';

import Layout from '../../../components/layout';
import SEO from '../../../components/seo';
import AuthBox from '../../../components/boxes/AuthBox';
import BoxSpinner from '../../../components/spinners/BoxSpinner';
import useUser from '../../../hooks/useUser';
import useEffectOnce from '../../../hooks/useEffectOnce';

import { syncUser } from '../../../graphqlCustom/functions';

/*
 * This page is what we're redirected to by Stripe after a checkout success!
 */
const CheckoutSuccess = () => {
  const user = useUser({ isPublic: false });

  // 1. Send sync user event to trigger lambda function to sync ddb user
  // 2. Redirect to /account/ page immediately with proper toasts to pop
  useEffectOnce(() => {
    if (user) {
      // 1. Trigger lambda
      API.graphql({
        query: syncUser,
        authMode: 'AMAZON_COGNITO_USER_POOLS'
      });

      // 2. Redirect to account/
      navigate('/account', {
        state: {
          toastsToPop: [
            {
              type: 'success',
              title: 'Checkout success',
              message: 'Congratulations on your purchase!'
            }
          ]
        }
      });
    }
  }, [user]);

  return (
    <Layout
      hideFooter
      isSimpleNavbar
      mainClassName="h-full bg-gray-200 absolute inset-0"
      innerMainClassName="justify-center items-center"
    >
      <SEO title="CheckoutSuccess" />
      <div className="flex items-center justify-center bg-white rounded-lg shadow-lg">
        <AuthBox
          Icon={<BoxSpinner className="bg-green-500" />}
          title={<h3>One moment please.</h3>}
          className="flex flex-col items-center justify-center w-84 md:w-full"
        >
          <div className="text-base text-gray-500 md:text-sm sm:text-xs">
            Redirecting to Chummy...
          </div>
        </AuthBox>
      </div>
    </Layout>
  );
};
export default CheckoutSuccess;
