/* Amplify Params - DO NOT EDIT
	API_CHUMMY_BOOKMARKTABLE_ARN
	API_CHUMMY_BOOKMARKTABLE_NAME
	API_CHUMMY_GRAPHQLAPIENDPOINTOUTPUT
	API_CHUMMY_GRAPHQLAPIIDOUTPUT
	API_CHUMMY_GRAPHQLAPIKEYOUTPUT
	API_CHUMMY_USERTABLE_ARN
	API_CHUMMY_USERTABLE_NAME
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const Stripe = require('stripe');
const SSM = new (require('aws-sdk/clients/ssm'))();
const AWS = require('aws-sdk');
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

const { createOrGetUserCollection, updateUserCollection } = require('./util');

exports.handler = async (event, context, callback) => {
  // Create and get user collection
  const { user, isNewSignup } = await createOrGetUserCollection(
    event?.request?.userAttributes['custom:ddb_id'],
    event
  );
  const cognitoId = user?.id;

  // If it's not a new signup, the following steps have already been done.
  // Theoretically should never happen because lambda trigger is post confirmation trigger,
  // and user is only confirmed once.
  if (!isNewSignup) {
    console.log('User has already been created');
    callback(null, event);
    return;
  }

  // Grab stripe keys from SSM
  const stripeSecretKeyName =
    process.env.ENV === 'prod'
      ? `STRIPE_LIVE_SECRET_KEY`
      : `STRIPE_TEST_SECRET_KEY`;

  const stripeSecretKey = (
    await SSM.getParameter({
      Name: stripeSecretKeyName,
      WithDecryption: true
    }).promise()
  )?.Parameter?.Value;

  // Initialize Stripe
  const stripe = Stripe(stripeSecretKey);

  // Create new customer on Stripe
  const customer = await stripe.customers.create({
    email: event?.request?.userAttributes?.email,
    name: event?.request?.userAttributes?.name,
    description: event?.request?.userAttributes?.profile,
    metadata: {
      cognitoUsername: event?.userName,
      cognitoUserPoolId: event?.userPoolId,
      cognitoSub: cognitoId,
      githubProfile: event?.request?.userAttributes?.profile
    }
  });

  // Update ddb user with metadata (cognito and stripe id's)
  const finalUser = await updateUserCollection(cognitoId, {
    metadata: {
      cognitoUsername: event?.userName,
      cognitoUserPoolId: event?.userPoolId,
      stripeId: customer?.id
    }
  });

  // Update cognito user with custom attributes
  cognitoidentityserviceprovider.adminUpdateUserAttributes(
    {
      UserAttributes: [
        {
          Name: 'custom:stripe_id',
          Value: customer?.id
        },
        {
          Name: 'custom:ddb_id',
          Value: finalUser?.id
        }
      ],
      UserPoolId: event?.userPoolId,
      Username: event?.userName
    },
    function (err, data) {
      console.error('Error updating Cognito attributes', err, data);
    }
  );

  callback(null, event);
};
