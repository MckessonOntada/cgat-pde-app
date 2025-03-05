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
    label: 'Roles',
    valueKey: 'roleName'
  },
  {
    key: 'users',
    label: 'Users',
    valueKey: 'userName'
  }
];

export const RuleKeys = {
  PRICE: 'price',
  ACCOUNTS: 'accounts',
  THERAPIES: 'therapies',
  USER_ROLE: 'user_role',
  USER_NAME: 'user_name'
};

export const RuleLabels = {
  PRICE: 'Price',
  ACCOUNT: 'Account',
  CATALOG: 'Catalog',
  USER_ROLE: 'User Role',
  USER_NAME: 'User Name'
};

export const RuleValueKeys = {
  PRICE: '',
  ACCOUNTS: 'accountId',
  CATALOG: 'therapyId',
  USER_ROLE: 'userId',
  USER_NAME: 'userId'
};

export const CONTROL_OPTIONS = {
  Price: 'Price',
  Account: 'Account',
  Catalog: 'Catalog',
  Roles: 'Roles',
  Users: 'Users'
};

export const getRuleOperator = (key, t) =>
  ({
    Catalog: t('rules.operator.orderedOfAny'),
    Price: t('rules.operator.greaterThan'),
    Account: t('rules.operator.selectedAnyOf'),
    Roles: t('rules.operator.selectedAnyOf'),
    Users: t('rules.operator.selectedAnyOf')
  }[key]);

export const getRuleLabel = (key) => {
  const rule = RulesConfig.find((rule) => rule.key === key);
  return rule ? rule.label : key; // Return label if found, otherwise return key
};
