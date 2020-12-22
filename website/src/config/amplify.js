import Amplify from 'aws-amplify';
// import browser from 'webextension-polyfill';
import awsExports from '../aws-exports';

export default () => {
  Amplify.configure(awsExports);
};
