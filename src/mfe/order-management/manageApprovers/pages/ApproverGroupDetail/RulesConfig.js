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
    label: 'User Role',
    valueKey: 'roleName'
  },
  {
    key: 'users',
    label: 'User Name',
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
  'User Role': 'User Role',
  'User Name': 'User Name'
};

export const getRuleOperator = (key, t, isViewMode) =>
  ({
    Catalog: isViewMode ? t('rules.operator.matchesofAny') : t('rules.operator.orderedOfAny'),
    Price: t('rules.operator.greaterThan'),
    Account: isViewMode ? t('rules.operator.matchesofAny') : t('rules.operator.selectedAnyOf'),
    'User Role': isViewMode ? t('rules.operator.matchesofAny') : t('rules.operator.selectedAnyOf'),
    'User Name': isViewMode ? t('rules.operator.matchesofAny') : t('rules.operator.selectedAnyOf')
  }[key]);

export const getRuleLabel = (key) => {
  const rule = RulesConfig.find((rule) => rule.key === key);
  return rule ? rule.label : key; // Return label if found, otherwise return key
};
