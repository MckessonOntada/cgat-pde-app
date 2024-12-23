export const PATHS = {
  bankAccounts: 'bank-accounts',
  creditCards: 'credit-cards',
};

export const tabListData = [
  {
    id: 1,
    configName: "Bank Accounts",
    isActive: true,
    isActiveTab: true,
    sequence: 1,
    labelForMobile: "Bank Accounts",
    path:PATHS.bankAccounts,
  }, ,
  {
    id: 2,
    configName: "Credit Cards",
    isActive: false,
    isActiveTab: false,
    sequence: 2,
    labelForMobile: "Credit Cards",
    path:PATHS.creditCards,
  }
]