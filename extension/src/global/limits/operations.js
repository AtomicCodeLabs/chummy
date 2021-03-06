import { THROTTLING_OPERATION, ACCOUNT_TYPE } from '../constants';

const OperationLimits = {
  [THROTTLING_OPERATION.CreateBookmark]: {
    [ACCOUNT_TYPE.Community]: 15,
    [ACCOUNT_TYPE.Professional]: 100000000,
    [ACCOUNT_TYPE.Enterprise]: 100000000
  },
  [THROTTLING_OPERATION.OpenTabs]: {
    [ACCOUNT_TYPE.Community]: 10,
    [ACCOUNT_TYPE.Professional]: 100000000,
    [ACCOUNT_TYPE.Enterprise]: 100000000
  }
};

export default OperationLimits;
