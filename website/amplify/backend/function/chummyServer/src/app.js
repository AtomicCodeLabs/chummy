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
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

const { getSecretStripeWebhookKey } = require('./util');

// declare a new express app
const app = express();
app.use(awsServerlessExpressMiddleware.eventContext());
app.use((req, res, next) => {
  var data_stream = '';

  // Readable streams emit 'data' events once a listener is added
  req
    .setEncoding('utf-8')
    .on('data', function (data) {
      data_stream += data;
    })
    .on('end', function () {
      req.rawBody;
      req.rawBody = data_stream;
      next();
    });
});

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

/****************************
 * Example post method *
 ****************************/

// Methods called by Stripe
const resolveStripeEvent = async (req, res) => {
  console.log('STRIPE EVENt', req);
  return res.status(200).send('Stripe event handled successfully!');
};

const resolveStripeRequest = async (req, res) => {
  // Check if request is coming from Stripe
  const stripeSignature = req.headers['stripe-signature'];
  try {
    const endpointSecret = await getSecretStripeWebhookKey();
    const stripeEvent = Stripe.webhooks.constructEvent(
      req.rawBody,
      stripeSignature,
      endpointSecret
    );
    return await resolveStripeEvent(stripeEvent, res);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
  }
  return res.status(400).send(`Webhook Error: ${err.message}`);
};

app.post('/stripe-webhook', async (req, res) => {
  return await resolveStripeRequest(req, res);
});

app.post('/stripe-webhook/*', async (req, res) => {
  return await resolveStripeRequest(req, res);
});

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;
