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
    return [account.houseNumber, account.street, account.district, account.city, account.state, account.zipCode].filter(Boolean).join(', ');
  };

