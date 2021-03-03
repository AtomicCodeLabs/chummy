import { Auth } from 'aws-amplify';
import { Signer } from '@aws-amplify/core';
import axios from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay });

const lambdaApi = async (functionName, requestObj) => {
  const cred = await Auth.currentCredentials();
  if (!cred) {
    console.error('Cannot call lambda because not signed in');
    return;
  }
  const essentialCred = Auth.essentialCredentials(cred);

  const serviceInfo = {
    region: 'us-west-2',
    service: 'lambda'
  };
  const accessInfo = {
    secret_key: essentialCred.secretAccessKey,
    access_key: essentialCred.accessKeyId,
    session_token: essentialCred.sessionToken
  };
  const request = {
    url: `https://lambda.${serviceInfo.region}.amazonaws.com/2015-03-31/functions/${functionName}/invocations`,
    ...requestObj
  };
  const signedRequest = Signer.sign(request, accessInfo, serviceInfo);

  // synchronous post request
  axios({
    method: 'POST',
    ...signedRequest
  });
};

export default lambdaApi;
