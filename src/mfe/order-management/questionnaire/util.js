import CommonUtils from '@src/util/CommonUtils';

export const MasterEntityType = {
  Material: 'Material',
  Catalog: 'Catalog',
  Account: 'Account'
};

export const getEntityTypeFlags = (selectedEntityType) => {
  return {
    isMaterial: selectedEntityType === MasterEntityType.Material,
    isCatalog: selectedEntityType === MasterEntityType.Catalog,
    isAccount: selectedEntityType === MasterEntityType.Account
  };
};

export const getAddress = (account) => {
  const sanitizedAccount = CommonUtils.sanitizeValue(account);
  return [
    sanitizedAccount.houseNumber,
    sanitizedAccount.street,
    sanitizedAccount.district,
    sanitizedAccount.city,
    sanitizedAccount.state,
    sanitizedAccount.zipCode
  ]
    .filter(Boolean)
    .join(', ');
};
