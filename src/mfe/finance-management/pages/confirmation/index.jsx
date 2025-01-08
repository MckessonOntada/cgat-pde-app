import React from 'react';
import { Heading, Button, CustomDataTable, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import CommonUtils from '@src/util/CommonUtils';
import { useNavigate, useParams } from 'react-router-dom';
import MetricsCard from './MetricsCard';
import ConfirmationTable from './ConfirmationTable';
import { useAccountContext } from '../../context/AccountContext';
import './assets/index.scss';
import { PATHS } from '../../routes';

const Confirmation = ({
  type,
  backText,
  invoiceColumns,
  creditColumns,
  invoiceData,
  creditData,
  paginationConfig,
  isFetching,
}) => {
  const { t } = useTranslate();
  const { confirmationNumber } = useParams();
  const { selectedAccount } = useAccountContext();
  const navigate = useNavigate();

  const invoiceDetails = {
    Bill: 339829172,
    Reference: 339829172,
    'PO#': 'LYNX_CART_231207115913',
    'Payment Term': '1-15,N25TH/16-EOM,N10TH PROX'
  };

  const billDates = {
    'Amount Debited': '$2318.23',
    'Credit Used': '$231',
    'Payment Initiated Date': 'Dec 07, 2024',
    ...(type === PATHS.paymentHistory && { 'Payment Authorised Date': 'Dec 25, 2024' })
  };

  const onBackToPaymentsInvoices = () => {
    navigate(-1);
  };

  const renderBackButton = () => (
    <Button
      className="back-button-control"
      variant="tertiary"
      Icon={() => <IconArrowLeft />}
      onClick={onBackToPaymentsInvoices}
      size="md">
      {backText || t('paymentInvoices.Details.backToManageInvoices')}
    </Button>
  );

  const renderMetricsCard = () => (
    CommonUtils.isNonEmptyObject(selectedAccount) && (
      <MetricsCard selectedAccount={selectedAccount} invoiceDetails={invoiceDetails} billDates={billDates} />
    )
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
        invoiceColumns={invoiceColumns}
        invoiceData={invoiceData}
        creditColumns={creditColumns}
        creditData={creditData}
        paginationConfig={paginationConfig}
        isFetching={isFetching}
      />
      {renderFooterButtons()}
    </div>
  );
};

export default Confirmation;
