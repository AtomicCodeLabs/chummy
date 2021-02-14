import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import axiosRetry from 'axios-retry';

const stripeAxios = axios.create({
  baseURL: 'https://api.stripe.com/v1',
  timeout: 3000,
  headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` }
});

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

let stripePromise;

// https://stripe.com/docs/libraries
const getStripe = () => {
  // Initialize stripe only once
  // https://www.gatsbyjs.com/tutorial/ecommerce-tutorial/#add-the-stripe-source-plugin
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export default getStripe;

// A helper method to make API request to Stripe
export const stripeApi = async (url, params) => {
  try {
    const response = await stripeAxios.get(url, {
      params
    });
    return response;
  } catch (error) {
    console.error('Error fetching from Stripe', error);
    return error;
  }
};
