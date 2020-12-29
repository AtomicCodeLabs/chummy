import Amplify from 'aws-amplify';
// Hello
import awsExports from '../aws-exports';

export default () => {
  Amplify.configure(awsExports);
};
