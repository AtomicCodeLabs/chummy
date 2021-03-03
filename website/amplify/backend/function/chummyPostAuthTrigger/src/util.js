const https = require('https');
const AWS = require('aws-sdk');
const SSM = new (require('aws-sdk/clients/ssm'))();

const operations = require('./queries');

const APPSYNC_URL = process.env.API_CHUMMY_GRAPHQLAPIENDPOINTOUTPUT;
const APPSYNC_API_KEY = process.env.API_CHUMMY_GRAPHQLAPIKEYOUTPUT;
const APPSYNC_ENDPOINT = new URL(APPSYNC_URL).hostname.toString();
const ENV = process.env.ENV;
const stripeSecretKeyName =
  ENV === 'prod' ? `STRIPE_LIVE_SECRET_KEY` : `STRIPE_TEST_SECRET_KEY`;

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

// Gets user doc, creates one if it doesn't exist
const createOrGetUserCollection = async (userId, event) => {
  // Check if user exists in DDB
  let userDoc;
  let isNewSignup = true;
  let error;

  try {
    // Try fetching first
    if (userId) {
      console.log('[READ] User collection + all user bookmarks read');
      const data = await makeRequest(operations.getUser, 'getUser', {
        id: userId
      });
      if (data?.errors) {
        throw new Error(JSON.stringify(data?.errors));
      }
      userDoc = data?.getUser;
      if (userDoc) {
        isNewSignup = false;
      }
    }
  } catch (e) {
    error = e;
  }

  // If user doesn't exist, try creating one.
  if (isNewSignup) {
    try {
      // User doesn't exist, so create one
      console.log('[WRITE] User collection created');
      const newUser = {
        id: userId,
        accountType: 'community',
        owner: event.userName,
        onMailingList: 'true'
      };
      const data = await makeRequest(operations.createUser, 'createUser', {
        input: newUser
      });
      if (data?.errors) {
        throw new Error(JSON.stringify(data?.errors));
      }
      userDoc = data?.createUser;
    } catch (e) {
      error = e;
    }
  }

  if (error) {
    throw new Error(error);
  }

  return { user: userDoc, isNewSignup };
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

// Grab stripe keys from SSM
const getSecretStripeKey = async () => {
  return (
    await SSM.getParameter({
      Name: stripeSecretKeyName,
      WithDecryption: true
    }).promise()
  )?.Parameter?.Value;
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
  console.log("Fetched prices", prices);

  return prices.find(
    ({ nickname }) => nickname === `${capitalize(tier)} ${capitalize(type)}`
  )?.id;
};

exports.getSecretStripeKey = getSecretStripeKey;
exports.getPriceId = getPriceId;
exports.createOrGetUserCollection = createOrGetUserCollection;
exports.updateUserCollection = updateUserCollection;
