import Amplify from 'aws-amplify';
import awsExports from '../aws-exports';

export default () => {
  Amplify.configure(awsExports);
};
