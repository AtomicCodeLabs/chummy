const SSM = new (require('aws-sdk/clients/ssm'))();

const stripeSecretKeyName = `STRIPE_WEBHOOK_SECRET_${process.env.ENV}`;

// Grab stripe webook secret keys from SSM
const getSecretStripeWebhookKey = async () => {
  return (
    await SSM.getParameter({
      Name: stripeSecretKeyName,
      WithDecryption: true
    }).promise()
  )?.Parameter?.Value;
};

exports.getSecretStripeWebhookKey = getSecretStripeWebhookKey;
