import React from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import CommonUtils from '@src/util/CommonUtils';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import MetricsCard from './MetricsCard';
import ConfirmationTable from './ConfirmationTable';
import { useAccountContext } from '../../context/AccountContext';
import './assets/index.scss';
import { PATHS } from '../../routes';
import dayjs from 'dayjs';

const Confirmation = ({ type, backText, paginationConfig, isFetching }) => {
  const { t } = useTranslate();
  const { confirmationNumber } = useParams();
  const { selectedAccount } = useAccountContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const invoiceDetails = {
    'Account Number': selectedAccount?.accountNumber || '-',
    'Payment Method': state?.paymentMethod,
    'Pay On': (type === PATHS.paymentHistory ? state?.paymentTypeText : state?.payOn) || '-',
    'Payment Initiated By': state?.userName || state?.initiatedBy || '-'
  };
  const formatCurrency = (amount) => {
    const validAmount = isNaN(amount) ? 0 : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(validAmount);
  };

  const billDates = {
    ...(type === PATHS.paymentHistory && { 'Amount Debited': formatCurrency(state && state.totalAuthorizedPaymentAmount) || '-' }),
    ...(type === PATHS.pendingPayments && { 'Account Debited': formatCurrency(state && state.authorizedAmt) || '-' }),
    'Credit Used': formatCurrency(state && state.totalCreditAmount) || '-',
    'Payment Initiated Date':
      state && state.paymentInitiationDate ? dayjs(state.paymentInitiationDate, 'DD/MM/YYYY').format('MMM D, YYYY') : '-',
    ...(type === PATHS.paymentHistory && {
      'Payment Authorised Date': state && state.clearingDate ? dayjs(state.clearingDate, 'DD/MM/YYYY').format('MMM D, YYYY') : '-'
    })
  };

  const onBackToPaymentsInvoices = () => {
    navigate(-1);
  };

  const renderBackButton = () => (
    <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={onBackToPaymentsInvoices} size="md">
      {backText || t('paymentInvoices.Details.backToManageInvoices')}
    </Button>
  );

  const renderMetricsCard = () =>
    CommonUtils.isNonEmptyObject(selectedAccount) && (
      <MetricsCard selectedAccount={selectedAccount} invoiceDetails={invoiceDetails} billDates={billDates} />
    );

  const renderFooterButtons = () => (
    <div className="footer-section">
      <Button variant="secondary" onClick={() => {}} size="sm">
        {type === PATHS.paymentHistory ? t('paymentInvoices.history.filters.printSummary') : t('paymentInvoices.CS.ExportExcel')}
      </Button>
      <Button onClick={() => {}} size="sm">
        {type === PATHS.paymentHistory ? t('paymentInvoices.history.filters.downloadExcel') : t('paymentInvoices.Details.print')}
      </Button>
    </div>
  );

  return (
    <div className="view-details-container">
      <div>{renderBackButton()}</div>
      <Heading>{`Confirmation - ${confirmationNumber}`}</Heading>
      <div className="details-card-wrapper">{renderMetricsCard()}</div>
      <ConfirmationTable
        invoiceData={state?.invoices}
        creditData={state?.credits}
        paginationConfig={paginationConfig}
        isFetching={isFetching}
      />
      {renderFooterButtons()}
    </div>
  );
};

export default Confirmation;
