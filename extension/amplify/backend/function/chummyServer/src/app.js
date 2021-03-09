/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

/* Amplify Params - DO NOT EDIT
	API_CHUMMY_GRAPHQLAPIENDPOINTOUTPUT
	API_CHUMMY_GRAPHQLAPIIDOUTPUT
	API_CHUMMY_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const Stripe = require('stripe');
const express = require('express');
const bodyParser = require('body-parser');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const {
  updateUserCollection,
  getSecretStripeKey,
  getSecretStripeWebhookKey,
  getAccountTypeFromProductName,
  getPriceId
} = require('./util');

// declare a new express app
const app = express();
app.use(awsServerlessExpressMiddleware.eventContext());
app.use(
  bodyParser.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// Methods called by Stripe
const processStripeEvent = async (req) => {
  const stripeSecretKey = await getSecretStripeKey();
  const stripe = Stripe(stripeSecretKey);
  console.log(req.type, req, req.type === 'customer.subscription.created');

  // Called when subscription is created
  // When a subscription is created via client checkout page
  if (req.type === 'customer.subscription.created') {
    // 1. Make sure customer doesn't have any other subscriptions.
    // If they do cancel all active subscriptions except the most recent one
    const subscriptions = [
      ...(
        await stripe.subscriptions.list({
          customer: req?.data?.object?.customer,
          status: 'active'
        })
      )?.data,
      ...(
        await stripe.subscriptions.list({
          customer: req?.data?.object?.customer,
          status: 'trialing'
        })
      )?.data
    ];
    console.log('Fetched active & trialing subscriptions', subscriptions);
    subscriptions.forEach(({ id: subId }) => {
      // If not the subscription you just created
      if (subId !== req?.data?.object?.id) {
        console.log(
          'Only 1 subscription allowed at a time. Canceling invalid subscription:',
          subId
        );
        stripe.subscriptions.del(subId);
      }
    });

    // 2. Update accountType in DDB user
    const productId = req?.data?.object?.plan?.product;
    // Figure out which product customer bought
    const product = await stripe.products.retrieve(productId);
    console.log('Fetched product information', product);
    const newAccountType = getAccountTypeFromProductName(product?.name);
    const customer = await stripe.customers.retrieve(
      req?.data?.object?.customer
    );
    console.log(
      `Customer ${customer?.id} bought this product`,
      product,
      'and will get edition',
      newAccountType
    );
    await updateUserCollection(customer?.metadata?.ddbId, {
      accountType: newAccountType,
      isTrial: req?.data?.object?.metadata?.isTrial ? 'true' : 'false'
    });
    console.log('Updated user collection');

    // 3. Send a welcome and invoice email.
    if (req?.data?.object?.metadata?.isTrial) {
      // Trial subscription to professional was created, so send welcome and enjoy
      // trial email.
      console.log('Welcome to trial and invoice email sent.');
    } else {
      // Customer explicitly bought professional subscription, so send welcome email.
      console.log('Thank you and invoice email sent.');
    }

    return;
  }

  // Called when trial or normal subscription is canceled.
  if (req.type === 'customer.subscription.deleted') {
    // Subscriptions can end if:
    // (1) customer created a new subscription and old ones are
    // being deleted
    // (2) customer cancelled a subscription and it expired
    // (3) a trial expires
    //
    // Exclusive conditions to check for
    // (1) customer has only one active subscription
    // (2) customer has no active subscriptions and has >1 canceled subscription
    // (3) customer has no active subscriptions and has =1 canceled subscription (the trial)
    //
    // Outbound actions
    // (1) do nothing
    // (2) send goodbye email confirming subscription cancellation
    // (3) send trial end and renewal email

    const activeSubscription = await stripe.subscriptions.list({
      customer: req?.data?.object?.customer,
      limit: 1,
      status: 'active'
    });
    console.log('Fetched active subscription', activeSubscription);

    // Case 1
    if (activeSubscription?.data?.length !== 0) {
      // Do nothing
      console.log(
        'Case 1: Noop. Subsription being canceled because a new one was created.'
      );
    }
    // Case 2 & 3
    else {
      // Get more information from number of past canceled subscriptions
      const subscriptions = await stripe.subscriptions.list({
        customer: req?.data?.object?.customer,
        limit: 2,
        status: 'ended'
      });
      console.log('Fetched at most two completed subscriptions', subscriptions);

      // Case 2
      if (subscriptions?.data?.length > 1) {
        // Send goodbye email confirming subscription cancellation
        console.log('Case 2: Active subscription was cancelled.');
      }
      // Case 3
      else {
        // subscriptions?.data?.length <= 1 && subscriptions?.data?.[0]?.metadata?.isTrial // sanity check
        // Send trial end and renewal email.
        console.log('Case 3: Trial subscription was cancelled.');
      }
      // In both cases, downgrade account to community
      const customer = await stripe.customers.retrieve(
        req?.data?.object?.customer
      );
      console.log('Fetched customer', customer);
      await updateUserCollection(customer?.metadata?.ddbId, {
        accountType: 'community',
        isTrial: false
      });
      console.log('Customer downgraded to Community');
    }

    return;
  }

  // Called when trial will end soon
  if (req.type === 'customer.subscription.trial_will_end') {
    console.log('Trial will end soon');
    // Send email to customer asking them to renew
    return;
  }

  console.warn('This stripe event is not handled.');
  throw new Error('Unhandled stripe event', req?.type);
};

const resolveStripeRequest = async (req) => {
  // Check if request is coming from Stripe
  const stripeSignature = req.headers['stripe-signature'];
  try {
    const endpointSecret = await getSecretStripeWebhookKey();
    const stripeEvent = Stripe.webhooks.constructEvent(
      req.rawBody,
      stripeSignature,
      endpointSecret
    );
    await processStripeEvent(stripeEvent);
    return true;
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
  }
  return false;
};

const cancelSubscription = async (req) => {
  console.log('Cancel subscription request is being processed', req);
  const stripeSecretKey = await getSecretStripeKey();
  const stripe = Stripe(stripeSecretKey);

  const activeSubscription = await stripe.subscriptions.list({
    customer: req?.body?.customer,
    status: 'active',
    limit: 1
  });

  console.log(
    'Fetched active subscription',
    activeSubscription,
    activeSubscription?.data?.[0]?.items?.data
  );

  // If no active subscriptions, return and throw error
  if (activeSubscription?.data?.length === 0) {
    console.error('No active subscription to cancel.');
    return false;
  }

  // See what next invoice would look like with a plan switch
  // https://stackoverflow.com/questions/24790776/stripe-api-refund-after-subscription-cancelled
  const prorationDate = Math.floor(Date.now() / 1000);
  console.log('Proration date', prorationDate);
  const previewInvoices = await stripe.invoices.retrieveUpcoming({
    customer: req?.body?.customer,
    subscription: activeSubscription?.data?.[0]?.id,
    subscription_items: [
      {
        id: activeSubscription?.data?.[0]?.items?.data?.[0]?.id,
        price: activeSubscription?.data?.[0]?.items?.data?.[0]?.price?.id,
        quantity: 0
      }
    ],
    subscription_proration_date: prorationDate
  });
  console.log(
    'Fetched preview of upcoming proration subscription',
    previewInvoices,
    previewInvoices?.lines?.data
  );

  // Calculate proration cost:
  const temporaryInvoice = previewInvoices?.lines?.data.find(
    (invoice) => invoice?.period?.start === prorationDate
  ); // temp invoice made to calculate refund
  if (!temporaryInvoice) {
    console.error('Error creating temporary proration invoice');
    return false;
  }
  console.log('Temporary invoice', temporaryInvoice);
  // Minus Stripe's fee
  const maxRefund =
    activeSubscription?.data?.[0]?.items?.data?.[0]?.price?.unit_amount;
  const refund = Math.ceil(
    // round up
    Math.min(
      // floor 0
      Math.max(
        // ceiling subscription price
        Math.abs(temporaryInvoice?.amount) - (30 + 0.029 * maxRefund), // minus Stripe fees
        maxRefund
      ),
      0
    )
  );
  // Refund prorated invoice that was created upon subscription cancellation
  console.log('Calculated refund to be', refund);
  if (refund !== 0) {
    const oneCharge = await stripe.charges.list({
      customer: req?.body?.customer,
      limit: 1
    });
    console.log("Fetched customer's charges", oneCharge?.data);
    const chargeId = oneCharge?.data?.[0]?.id;
    if (!chargeId) {
      console.error(
        'Customer does not have valid charges for this subscription'
      );
      return false;
    }

    // Customer has payment method
    const createdRefund = await stripe.refunds.create({
      charge: chargeId,
      amount: refund
    });
    console.log('Refund processed', createdRefund, 'on charge', chargeId);
  }

  // Cancel subscription
  const endedSubscription = await stripe.subscriptions.del(
    activeSubscription.data[0].id
  );
  console.log('Subscription canceled', endedSubscription?.canceled_at);

  return { id: endedSubscription?.id };
};

const getSession = async (req) => {
  // If enterprise, quantity must be >= 5.
  if (req?.body?.tier === 'enterprise' && (req?.body?.quantity || 1) < 5) {
    console.error(
      'Cannot purchase less than 5 subscriptions for enterprise tier'
    );
    return false;
  }
  // Everything checks out
  const stripeSecretKey = await getSecretStripeKey();
  const stripe = Stripe(stripeSecretKey);
  const priceId = await getPriceId(req?.body?.tier, req?.body?.type, stripe);
  console.log('Creating session for price', priceId);

  const session = await stripe.checkout.sessions.create({
    customer: req?.body?.customer,
    success_url: req?.body?.success_url,
    cancel_url: req?.body?.cancel_url,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: req?.body?.quantity || 1 }],
    mode: 'subscription'
  });
  console.log('Session created', session);
  return { id: session.id };
};

const resolveRequest = async (req, res, route) => {
  console.log('Received request at route', req, route);
  let succeeded = false;
  let response;
  switch (route) {
    case '/stripe-webhook':
      succeeded = await resolveStripeRequest(req);
      break;
    case '/cancel-subscription':
      response = await cancelSubscription(req);
      break;
    case '/session':
      response = await getSession(req);
      break;
    default:
      console.error('The provided route cannot be handled.');
      break;
  }

  if (response) {
    res.json(response);
    return;
  }
  if (succeeded) {
    res.status(200).send(`Request handled successfully!`);
    return;
  }

  res.status(400).send(`Route couldn't be resolved or other internal error.`);
};

app.post('/stripe-webhook', async (req, res) => {
  await resolveRequest(req, res, '/stripe-webhook');
});

app.post('/stripe-webhook/*', async (req, res) => {
  await resolveRequest(req, res, '/stripe-webhook');
});

app.post('/cancel-subscription/', async (req, res) => {
  await resolveRequest(req, res, '/cancel-subscription');
  // Set `cancel_at_period_end` attribute of existing subscription
});

app.post('/cancel-subscription/*', async (req, res) => {
  await resolveRequest(req, res, '/cancel-subscription');
  console.log('Cancel sub req', req, res);
});

/** Get a checkout session. Called when checkout button is clickedy **/
app.post('/session/', async (req, res) => {
  await resolveRequest(req, res, '/session');
});

app.post('/session/*', async (req, res) => {
  await resolveRequest(req, res, '/session');
});

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;
