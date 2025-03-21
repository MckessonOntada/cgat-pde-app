import dayjs from 'dayjs';
import { paymentMethod } from './constants';

export const onConfirmPayment = (selectedAccount, state, payInvoices, t, selectedSpecificDate) => {
  let payload = {
    companyCode: selectedAccount.companyCode,
    salesOrg: selectedAccount.salesOrg,
    payerAccountNumber: selectedAccount.accountNumber,
    paymentSchedule: {},
    isPartialPayment: false,
    invoices: [],
    credits: [],
    paymentMethod: {}
  };
  let _totalAmount = 0;
  let _totalpaymentAmount = 0;
  state.invoices.map((item) => {
    _totalAmount = _totalAmount + parseFloat(item.billAmount);
    _totalpaymentAmount = _totalpaymentAmount + parseFloat(item.paymentAmount);
  });
  if (_totalpaymentAmount < _totalAmount) {
    payload.isPartialPayment = true;
  }
  if (state.paymentOption == t('paymentInvoices.reviewPayments.payToday')) {
    payload.paymentSchedule.TODAY = dayjs().format('YYYY-MM-DD');
  }
  if (state.paymentOption == t('paymentInvoices.reviewPayments.payDuedate')) {
    let _due_date = state?.invoices.reduce((min, current) =>
      dayjs(current.dueDate, 'DD/MM/YYYY').isBefore(dayjs(min.dueDate, 'DD/MM/YYYY')) ? current : min
    );
    payload.paymentSchedule.DUE_DATE = dayjs(_due_date.dueDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
  }
  if (state.paymentOption == t('paymentInvoices.reviewPayments.paySpecfic')) {
    payload.paymentSchedule.SPECIFIC_DATE = dayjs(selectedSpecificDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
  }
  if (state.invoices) {
    state.invoices.map((item) => {
      payload.invoices.push({
        billId: item.billNumber,
        soldToSite: item.soldToSite,
        description: item.description,
        dueDate: dayjs(item.dueDate, 'DD/MM/YYYY').format('YYYY-MM-DD'),
        amount: item.billAmount,
        openAmount: item.openAmount,
        paymentAmount: parseFloat(item.paymentAmount),
        fiscalYear: item.fiscalYear
      });
    });
  }

  if (state.creditsSelected && state.creditsSelected.length > 0) {
    state.creditsSelected.map((item) => {
      payload.credits.push({
        billNumber: item.billNumber,
        amount: item.billAmount,
        soldToSite: item.soldToSite,
        fiscalYear: item.fiscalYear
      });
    });
  }
  if (state.selectedPayment) {
    let _selectedPayment = state.selectedPayment;
    let _accType = _selectedPayment.accType;
    payload.paymentMethod.paymentType = _accType;
    if (_accType == paymentMethod.BANK) {
      payload.paymentMethod.bank = {
        accountNumber: _selectedPayment.accountNumber,
        name: _selectedPayment.name,
        type: _selectedPayment.type
      };
    } else {
      let _credit = { ...{}, ..._selectedPayment };
      _credit = omitKeys(_credit, ['accType', 'label', 'name', 'value']);
      payload.paymentMethod.credit = _credit;
    }
  }
  payInvoices(payload);
};

const omitKeys = (object, keys = []) => {
  for (let ele of keys) {
    if (object && object[ele]) {
      delete object[ele];
    }
  }
};
