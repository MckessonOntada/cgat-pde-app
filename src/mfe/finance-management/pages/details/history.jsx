import React from 'react';
import { Heading } from '@mckesson/mcp-component-library';
import './viewDetails.scss';
import PaymentHistoryTable from '../paymentHistory/PaymentHistoryTable';
import { PaymentHistoryProvider, usePaymentHistory } from '../../context/PaymentHistoryContext';
import { useTranslate } from '@src/translations/useTranslation';

function HistoryTableWrapper(props) {
  const { data, isFetching, filterConfig } = usePaymentHistory();
  const { t } = useTranslate();
  if (isFetching || !data.length) return null;
  if (!filterConfig?.billNo || !Array.isArray(data) || data.length === 0) return null;
  return (
    <>
      <Heading as="h2" className="secondaryHeading">
        {t('paymentInvoices.table.paymentHistory')}
      </Heading>
      <PaymentHistoryTable />
    </>
  );
}

function History(props) {
  return (
    <PaymentHistoryProvider billNo={props?.billNumber}>
      <HistoryTableWrapper />
    </PaymentHistoryProvider>
  );
}

export default History;
