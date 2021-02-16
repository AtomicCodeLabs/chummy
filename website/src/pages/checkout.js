import React, { useState } from 'react';

import Link from '../components/Link';
import Layout from '../components/layout';
import SEO from '../components/seo';
import EditionsSection from '../components/sections/EditionsSection';

import usePrices from '../hooks/usePrices';
import getStripe from '../config/stripe';

const CheckoutPage = () => {
  const [loading, setLoading] = useState();
  const prices = usePrices();

  console.log('placeholder', loading, prices);

  const redirectToCheckout = async (event) => {
    event.preventDefault();

    setLoading(true);
    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      mode: 'subscription',
      lineItems: [{ price: 'price_1IKAOLBYrFSX6VWj1XLblSmM', quantity: 1 }],
      successUrl: new URL(
        'account/checkout/success',
        process.env.WEBSITE_BASE_URL
      ).toString(),
      cancelUrl: new URL(
        'account/checkout/error',
        process.env.WEBSITE_BASE_URL
      ).toString()
    });
    if (error) {
      console.warn('Error:', error);
      setLoading(false);
    }
  };

  return (
    <Layout
      isSimpleNavbar
      mainClassName="h-screen bg-white"
      innerMainClassName="justify-start items-center"
      navbarSecondaryBgColor="bg-gray-200"
      footerClassName="mt-32 w-full inset-x-0"
      fitFooter
    >
      <SEO title="Checkout" />
      <h1>Checkout</h1>
      <button
        type="button"
        className="text-base font-light text-green-600 focus:outline-none sm:text-sm"
        onClick={redirectToCheckout}
      >
        Redirect to checkout
      </button>
      <EditionsSection />
      <Link to="/">Go home</Link>
    </Layout>
  );
};

export default CheckoutPage;
