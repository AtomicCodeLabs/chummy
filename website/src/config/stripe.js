import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

const getStripe = () => {
  // Initialize stripe only once
  // https://www.gatsbyjs.com/tutorial/ecommerce-tutorial/#add-the-stripe-source-plugin
  if (!stripePromise) {
    stripePromise = loadStripe('<YOUR STRIPE PUBLISHABLE KEY>');
  }
  return stripePromise;
};

export default getStripe;
