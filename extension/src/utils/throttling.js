/* eslint-disable import/prefer-default-export */
import { ACCOUNT_TYPE, THROTTLING_OPERATION } from '../global/constants';
import OperationLimits from '../global/limits/operations';

export const getMaxOpenTabLimit = (user) => {
  const defaultLimit =
    OperationLimits[THROTTLING_OPERATION.OpenTabs][ACCOUNT_TYPE.Community];
  if (!user?.accountType) return defaultLimit;

  const limit =
    OperationLimits[THROTTLING_OPERATION.OpenTabs]?.[user.accountType];
  if (limit !== null) {
    return limit;
  }

  return defaultLimit;
};
