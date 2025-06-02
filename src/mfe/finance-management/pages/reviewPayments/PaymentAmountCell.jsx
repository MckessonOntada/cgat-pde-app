import React, { useState, useEffect } from 'react';
import { FormattedNumber } from 'react-intl';

const PaymentAmountCell = ({ row, index, selectedInvoices, setSelectedInvoices, REVIEW_MODE }) => {
  const [inputValue, setInputValue] = useState(row.paymentAmount);

  useEffect(() => {
    setInputValue(row.paymentAmount);
  }, [row.paymentAmount]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    const updatedInvoices = [...selectedInvoices];
    updatedInvoices[index].paymentAmount = val;
    setSelectedInvoices(updatedInvoices);
  };

  const handleBlur = (e) => {
    const val = parseFloat(e.target.value);
    const finalVal = val > 0 && val <= row.openAmount ? val : row.openAmount;
    const updatedInvoices = [...selectedInvoices];
    updatedInvoices[index].paymentAmount = finalVal;
    setInputValue(finalVal);
    setSelectedInvoices(updatedInvoices);
  };

  const isError =
    inputValue > row.openAmount ||
    inputValue <= 0 ||
    inputValue === '' ||
    inputValue === null;

  if (REVIEW_MODE) {
    return (
      <div className="cellEllipse align-items-right">
        <FormattedNumber value={row.paymentAmount || 0} style="currency" currency="USD" />
      </div>
    );
  }

  return (
    <input
      type="number"
      className={`paymenyAmount-input ${isError ? 'error-input' : ''}`}
      value={inputValue}
      onChange={handleChange}
      min={0}
      onBlur={handleBlur}
    />
  );
};

export default PaymentAmountCell;
