const maskBankNumber = (accountNumber) => {
  if (!accountNumber) return '';
  const lastFourDigits = accountNumber.slice(-4) || 'XXXX';
  return `XXXX-XXXX-XXXX-${lastFourDigits}`;
};

const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return '';
  const lastFourDigits = cardNumber.slice(-4) || 'XXXX';
  return `XXXX-XXXX-XXXX-${lastFourDigits}`;
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
};

export const FinanceUtils = Object.freeze({
  maskBankNumber,
  maskCardNumber,
  formatCurrency
});
