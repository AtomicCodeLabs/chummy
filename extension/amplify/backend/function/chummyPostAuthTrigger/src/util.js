const https = require('https');
const AWS = require('aws-sdk');

const operations = require('./queries');

const APPSYNC_URL = process.env.API_CHUMMY_GRAPHQLAPIENDPOINTOUTPUT;
const APPSYNC_API_KEY = process.env.API_CHUMMY_GRAPHQLAPIKEYOUTPUT;
const APPSYNC_ENDPOINT = new URL(APPSYNC_URL).hostname.toString();

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

exports.createOrGetUserCollection = createOrGetUserCollection;
exports.updateUserCollection = updateUserCollection;
