export const RulesConfig = [
  {
    key: 'price',
    label: 'Price',
    valueKey: null // Directly use the value (not an array)
  },
  {
    key: 'accounts',
    label: 'Account',
    valueKey: 'accountName'
  },
  {
    key: 'therapies',
    label: 'Catalog',
    valueKey: 'therapyName'
  },
  {
    key: 'roles',
    label: 'Role',
    valueKey: 'roleName'
  },
  {
    key: 'users',
    label: 'User',
    valueKey: 'userName'
  }
];

export const RuleKeys = {
  PRICE: 'price',
  ACCOUNTS: 'accounts',
  THERAPIES: 'therapies',
  USERS: 'users',
  ROLES: 'roles'
};

export const RuleLabels = {
  [RuleKeys.PRICE]: 'Price',
  [RuleKeys.ACCOUNTS]: 'Account',
  [RuleKeys.THERAPIES]: 'Catalog',
  [RuleKeys.USERS]: 'User',
  [RuleKeys.ROLES]: 'User'
};

export const RuleValueKeys = {
  [RuleKeys.ACCOUNTS]: 'accountId',
  [RuleKeys.THERAPIES]: 'therapyId',
  [RuleKeys.USERS]: 'userId',
  [RuleKeys.ROLES]: 'roleId'
};
