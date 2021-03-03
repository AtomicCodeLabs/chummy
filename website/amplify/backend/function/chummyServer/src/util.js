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
const TEST_PRO_MONTHLY_PRICEID = 'price_1IKAOLBYrFSX6VWj1XLblSmM';
const TEST_PRO_YEARLY_PRICEID = 'price_1IKAOLBYrFSX6VWjNlbanArM';
const TEST_ENT_MONTHLY_PRICEID = 'price_1IKALGBYrFSX6VWjbC6BbkhR';
const TEST_ENT_YEARLY_PRICEID = 'price_1IKALGBYrFSX6VWjJQaFW6Eq';
const TEST_COM_PRICEID = 'price_1IJRbgBYrFSX6VWjNKNwvMRE';
const PROD_PRO_MONTHLY_PRICEID = 'price_1IJRaGBYrFSX6VWj3KouvKhl';
const PROD_PRO_YEARLY_PRICEID = 'price_1IJRaGBYrFSX6VWjS9ALtuH0';
const PROD_ENT_MONTHLY_PRICEID = 'price_1IJRaLBYrFSX6VWj0rhlXomA';
const PROD_ENT_YEARLY_PRICEID = 'price_1IJRaLBYrFSX6VWjD71sQ2C4';
const PROD_COM_PRICEID = 'price_1IJRcIBYrFSX6VWjIrcvbjLJ';
const testPriceIdMap = {
  monthly: {
    professional: TEST_PRO_MONTHLY_PRICEID,
    enterprise: TEST_ENT_MONTHLY_PRICEID,
    community: TEST_COM_PRICEID
  },
  yearly: {
    professional: TEST_PRO_YEARLY_PRICEID,
    enterprise: TEST_ENT_YEARLY_PRICEID,
    community: TEST_COM_PRICEID
  }
};
const prodPriceIdMap = {
  monthly: {
    professional: PROD_PRO_MONTHLY_PRICEID,
    enterprise: PROD_ENT_MONTHLY_PRICEID,
    community: PROD_COM_PRICEID
  },
  yearly: {
    professional: PROD_PRO_YEARLY_PRICEID,
    enterprise: PROD_ENT_YEARLY_PRICEID,
    community: PROD_COM_PRICEID
  }
};
const priceIdMap = {
  prod: prodPriceIdMap,
  dev: testPriceIdMap,
  gamma: testPriceIdMap
};

// Grab price id
const getPriceId = (tier = 'professional', type = 'monthly') => {
  return (
    priceIdMap?.[ENV]?.[type]?.[tier] || priceIdMap?.[ENV]?.yearly.community
  );
};

exports.updateUserCollection = updateUserCollection;
exports.getSecretStripeKey = getSecretStripeKey;
exports.getAccountTypeFromProductName = getAccountTypeFromProductName;
exports.getSecretStripeWebhookKey = getSecretStripeWebhookKey;
exports.getPriceId = getPriceId;
