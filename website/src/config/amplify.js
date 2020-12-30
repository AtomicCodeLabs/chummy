import Amplify from 'aws-amplify';
import awsExports from '../aws-exports';

export default () => {
  // configure if app isn't configured yet
  if (Object.keys(Amplify.configure()).length === 0) {
    Amplify.configure(awsExports);
  }
};
