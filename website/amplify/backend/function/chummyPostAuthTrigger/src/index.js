/* Amplify Params - DO NOT EDIT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const stripe = require('stripe')(
  'sk_test_51I4JdfBYrFSX6VWjmLWxUdVf6L54asmR3WwWpzy1o7dceB6nUBgECbzOQdUdu6L3Ca4tMOR9AD0AOgRusMaHjI3n00vrwdnshf'
);

exports.handler = async (event) => {
  console.log('event', event);

  // Create new customer on Stripe
  const customer = await stripe.customers.create({
    email: 'jenny.rosen@example.com',
    description: 'My First Test Customer (created for API docs)',
    metadata: {
      cognito_id: 'cognito_id_1'
    }
  });

  console.log('Created customer', customer);

  // TODO implement
  const response = {
    statusCode: 200,
    //  Uncomment below to enable CORS requests
    //  headers: {
    //      "Access-Control-Allow-Origin": "*",
    //      "Access-Control-Allow-Headers": "*"
    //  },
    body: JSON.stringify('Hello from Lambda!')
  };
  return response;
};
