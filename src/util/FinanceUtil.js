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
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

  function formatAmount(value) {
    const abs = Math.abs(value);

    if (abs >= 1e9) {
      return (value / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (abs >= 1e6) {
      return (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (abs >= 1e3) {
      return (value / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return value.toString();
  }

  export const FinanceUtils = Object.freeze({
    maskBankNumber,
    maskCardNumber,
    formatCurrency,
    formatAmount
  });
