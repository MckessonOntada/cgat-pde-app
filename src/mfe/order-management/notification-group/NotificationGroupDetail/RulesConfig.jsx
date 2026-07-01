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
    label: 'Material',
    valueKey: 'therapyName'
  },
  {
    key: 'triggers',
    label: 'Notification Triggers',
    valueKey: 'displayName'
  }
];

export const RuleKeys = {
  PRICE: 'price',
  ACCOUNTS: 'accounts',
  THERAPIES: 'therapies',
  TRIGGERS: 'triggers'
};

export const RuleLabels = {
  PRICE: 'Price',
  ACCOUNT: 'Account',
  CATALOG: 'Material',
  TRIGGER: 'Notification Triggers'
};

export const RuleValueKeys = {
  TRIGGERS: 'type',
  PRICE: '',
  ACCOUNTS: 'accountId',
  CATALOG: 'therapyId'
};

export const CONTROL_OPTIONS = {
  Price: 'Price',
  Account: 'Account',
  Material: 'Material'
};

export const getRuleOperator = (key, t, isViewMode) =>
  ({
    Trigger: isViewMode ? t('rules.operator.matchesofAny') : t('rules.operator.selectedAnyOf'),
    Material: isViewMode ? t('rules.operator.matchesofAny') : t('rules.operator.orderedOfAny'),
    Price: t('rules.operator.greaterThan'),
    Account: isViewMode ? t('rules.operator.matchesofAny') : t('rules.operator.selectedAnyOf')
  }[key]);

export const getRuleLabel = (key) => {
  const rule = RulesConfig.find((rule) => rule.key === key);
  return rule ? rule.label : key; // Return label if found, otherwise return key
};
