import React, { useRef } from 'react';
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
import { useExportStatementPDF } from './actions/actions';
import ApiRoutes from '@src/api/ApiRoutes';
import { GeographicUtils } from '@src/util/GeographicUtil';
import { useCustomPrint } from '@src/util/printUtils';

const Confirmation = ({ type, backText, paginationConfig, isFetching }) => {
  const { t } = useTranslate();
  const { confirmationNumber } = useParams();
  const { selectedAccount } = useAccountContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const exportType = type;
  const { mutate: exportStatementPDF } = useExportStatementPDF(exportType);
  const contentRef = useRef(null); 
  const printPage = useCustomPrint(contentRef, `
    .table-card-container {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    .details-table{
      page-break-inside: avoid;
      page-break-after: auto;
    }
    `);

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
      {type === PATHS.paymentHistory
        ? t('paymentInvoices.history.confirm.backToPaymentHistory')
        : t('pendingPayments.confirm.BackToPendingPayments')}
    </Button>
  );

  const renderMetricsCard = () =>
    CommonUtils.isNonEmptyObject(selectedAccount) && (
      <MetricsCard selectedAccount={selectedAccount} invoiceDetails={invoiceDetails} billDates={billDates} />
    );

  const handleExport = () => {
    const url = `${ApiRoutes.PENDING_PAYMENTS_LISTING(selectedAccount?.id)}/detail/individual/export?confirmationNo=${confirmationNumber}`;
    const payload = {
      companyCode: selectedAccount?.companyCode,
      salesOrg: selectedAccount?.salesOrg,
      payerAccountNumber: selectedAccount?.accountNumber,
      filter: {
        searchTerm: '',
        initiationDateStart: '',
        initiationDateEnd: ''
      },
      excelMetaDataDTO: {
        accountNumber: selectedAccount?.accountNumber,
        name: selectedAccount?.accountName,
        address: GeographicUtils.addressAggregator(selectedAccount)
      }
    };
    const type = 'xlsx';
    exportStatementPDF({ url, payload, type, confirmationNumber: confirmationNumber, t: t });
  };

  const handleDownload = () => {
    const url = `${ApiRoutes.PAYMENT_HISTORY_LISTING(selectedAccount?.id)}/detail/export?confirmationNo=${confirmationNumber}`;
    const payload = {
      companyCode: selectedAccount?.companyCode,
      salesOrg: selectedAccount?.salesOrg,
      payerAccountNumber: selectedAccount?.accountNumber,
      dateFrom: dayjs(state?.filterConfig?.dateRange[0], 'MM/DD/YYYY').format('DD/MM/YYYY') || '',
      dateTo: dayjs(state?.filterConfig?.dateRange[1], 'MM/DD/YYYY').format('DD/MM/YYYY') || '',
      paymentHistoryFilter: {
        searchTerm: '',
        paymentStatus: [],
        paymentMethod: []
      },
      excelMetaDataDTO: {
        accountNumber: selectedAccount?.accountNumber,
        name: selectedAccount?.accountName,
        address: GeographicUtils.addressAggregator(selectedAccount)
      }
    };
    const type = 'xlsx';
    exportStatementPDF({ url, payload, type, confirmationNumber: confirmationNumber, t: t });
  };

  const renderFooterButtons = () => (
    <div className="footer-section">
      <Button
        variant="secondary"
        onClick={type === PATHS.paymentHistory ? handleDownload :  () => printPage()}
        size="md"
        >
        {type === PATHS.paymentHistory ? t('paymentInvoices.CS.ExportExcel') : t('paymentInvoices.history.filters.printSummary')}
      </Button>
      <Button onClick={type === PATHS.paymentHistory ? () => printPage() : handleExport} size="md" >
        {type === PATHS.paymentHistory ? t('paymentInvoices.Details.print') : t('paymentInvoices.history.filters.downloadExcel')}
      </Button>
    </div>
  );

  return (
    <div className="view-details-container" ref={contentRef}>
      <div>{renderBackButton()}</div>
      <Heading as="h1">{`Confirmation - ${confirmationNumber}`}</Heading>
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
