/* eslint-disable import/prefer-default-export */
import { THROTTLING_OPERATION, ACCOUNT_TYPE } from '../global/constants.ts';
import OperationLimits from '../global/limits/operations';

export const isAllowed = (user, operation) => {
  if (!user.accountType) return false;

  // Creating a bookmark
  if (operation === THROTTLING_OPERATION.CreateBookmark) {
    if (!user.bookmarks) return false;
    // Check if user exceeds tier limit
    if (
      user.bookmarks.length >=
      OperationLimits[THROTTLING_OPERATION.CreateBookmark][user.accountType]
    ) {
      return false;
    }
    // If within limits, allow user to create bookmark
    return true;
  }

  // If user is professional or enterprise, they're allowed
  // to do anything
  if (
    user.accountType === ACCOUNT_TYPE.Professional ||
    user.accountType === ACCOUNT_TYPE.Enterprise
  ) {
    return true;
  }

  // Default
  return false;
};
