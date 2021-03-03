const https = require('https');
const AWS = require('aws-sdk');
const SSM = new (require('aws-sdk/clients/ssm'))();

const operations = require('./queries');

const APPSYNC_URL = process.env.API_CHUMMY_GRAPHQLAPIENDPOINTOUTPUT;
const APPSYNC_API_KEY = process.env.API_CHUMMY_GRAPHQLAPIKEYOUTPUT;
const APPSYNC_ENDPOINT = new URL(APPSYNC_URL).hostname.toString();

const ENV = process.env.ENV;
const stripeSecretWebhookKeyName = `STRIPE_WEBHOOK_SECRET_${ENV}`;
const stripeSecretKeyName =
  ENV === 'prod' ? `STRIPE_LIVE_SECRET_KEY` : `STRIPE_TEST_SECRET_KEY`;

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const makeRequest = async (query, operationName, variables) => {
  const req = new AWS.HttpRequest(APPSYNC_URL, APPSYNC_API_KEY);

  req.method = 'POST';
  req.path = '/graphql';
  req.headers.host = APPSYNC_ENDPOINT;
  req.headers['Content-Type'] = 'application/json';
  req.headers['x-api-key'] = APPSYNC_API_KEY;
  req.body = JSON.stringify({
    query,
    operationName,
    variables
  });

  const data = await new Promise((resolve, reject) => {
    const httpRequest = https.request(
      { ...req, host: APPSYNC_ENDPOINT },
      (result) => {
        result.on('data', (data) => {
          resolve(JSON.parse(data.toString()));
        });
      }
    );

    httpRequest.write(req.body);
    httpRequest.end();
  });
  return data?.data;
};

// Grab stripe webook secret keys from SSM
const getSecretStripeWebhookKey = async () => {
  return (
    await SSM.getParameter({
      Name: stripeSecretWebhookKeyName,
      WithDecryption: true
    }).promise()
  )?.Parameter?.Value;
};

// Grab stripe keys from SSM
const getSecretStripeKey = async () => {
  return (
    await SSM.getParameter({
      Name: stripeSecretKeyName,
      WithDecryption: true
    }).promise()
  )?.Parameter?.Value;
};

const getAccountTypeFromProductName = (productName) => {
  switch (productName) {
    case 'Chummy Professional':
      return 'professional';
    case 'Chummy Enterprise':
      return 'enterprise';
    default:
      return 'community';
  }
};

// Updates existing user
const updateUserCollection = async (userId, newUserObject) => {
  let user;
  try {
    console.log('[WRITE] User collection updated');
    const newUser = {
      id: userId,
      ...newUserObject
    };
    const data = await makeRequest(operations.updateUser, 'updateUser', {
      input: newUser
    });
    if (data?.errors) {
      throw new Error(JSON.stringify(data?.errors));
    }
    user = data?.updateUser;
  } catch (e) {
    throw new Error(e);
  }
  return user;
};

// https://dashboard.stripe.com/products
const TEST_PRODUCT_PRO = 'prod_Iw2ToEzxF2UP1b';
const TEST_PRODUCT_ENT = 'prod_Iw2Q8lOAe543xu';
const TEST_PRODUCT_COM = 'prod_IvICdMDKOEVBtS';
const PROD_PRODUCT_PRO = 'prod_IvIA7CcfiuHKUQ';
const PROD_PRODUCT_ENT = 'prod_IvIAUNAqTmzCQU';
const PROD_PRODUCT_COM = 'prod_IvICHeA5zZKlov';

const testProductIdMap = {
  professional: TEST_PRODUCT_PRO,
  enterprise: TEST_PRODUCT_ENT,
  community: TEST_PRODUCT_COM
};

const prodProductIdMap = {
  professional: PROD_PRODUCT_PRO,
  enterprise: PROD_PRODUCT_ENT,
  community: PROD_PRODUCT_COM
};

const priceIdMap = {
  prod: prodProductIdMap,
  dev: testProductIdMap,
  gamma: testProductIdMap
};

// Grab price id
const getPriceId = async (tier = 'professional', type = 'monthly', stripe) => {
  const productId = priceIdMap?.[ENV]?.[tier];

  const prices = await stripe.prices.list({
    active: true,
    product: productId
  })?.data;
  console.log('Fetched prices', prices);

  return prices.find(
    ({ nickname }) => nickname === `${capitalize(tier)} ${capitalize(type)}`
  )?.id;
};

exports.updateUserCollection = updateUserCollection;
exports.getSecretStripeKey = getSecretStripeKey;
exports.getAccountTypeFromProductName = getAccountTypeFromProductName;
exports.getSecretStripeWebhookKey = getSecretStripeWebhookKey;
exports.getPriceId = getPriceId;
