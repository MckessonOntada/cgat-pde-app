import React from 'react';
import { Heading } from '@mckesson/mcp-component-library';
import './viewDetails.scss';
import PaymentHistoryTable from '../paymentHistory/PaymentHistoryTable';
import { PaymentHistoryProvider, usePaymentHistory } from '../../context/PaymentHistoryContext';
import { useTranslate } from '@src/translations/useTranslation';

function Section({ titleKey, showPayOn = false }) {
  const { t } = useTranslate();
  const { data, isFetching, filterConfig } = usePaymentHistory();
  if (!filterConfig?.billNo || !Array.isArray(data) || data.length === 0 || isFetching) return null;

  return (
    <>
      <Heading as="h2" className="secondaryHeading">
        {t(titleKey)}
      </Heading>
      <PaymentHistoryTable isToShowPayOn={showPayOn} />
    </>
  );
}

export default function HistoryAndScheduledPayments({ billNumber }) {
  return (
    <>
      <PaymentHistoryProvider billNo={billNumber} paymentStatuses={['Cancelled', 'Processed']}>
        <Section titleKey="paymentInvoices.table.paymentHistory" />
      </PaymentHistoryProvider>

      <PaymentHistoryProvider billNo={billNumber} paymentStatuses={['In Process']}>
        <Section titleKey="paymentInvoices.table.schedulePayments" showPayOn />
      </PaymentHistoryProvider>
    </>
  );
}
