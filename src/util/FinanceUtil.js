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

export const FinanceUtils = Object.freeze({
  maskBankNumber,
  maskCardNumber
});
