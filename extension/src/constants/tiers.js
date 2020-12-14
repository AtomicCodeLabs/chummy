import { AccountType } from '../config/store/I.user.store.ts';

export const ALL = [
  AccountType.Community,
  AccountType.Professional,
  AccountType.Enterprise
];

export const NOT_COMMUNITY = [AccountType.Professional, AccountType.Enterprise];
