import React, { useEffect } from 'react';
import CreditCardsTable from './CreditCardsTable';
import './index.scss';
import InputField from '@src/components/form/InputField';
import { useTranslate } from '@src/translations/useTranslation';
import { usePaymentMethods } from '@src/mfe/finance-management/context/PaymentMethodsContext';

export default function CreditCards(params) {
  const { t } = useTranslate();
  const { filterCreditCards, refetchPaymentMethods } = usePaymentMethods();

  useEffect(() => {
    refetchPaymentMethods();
  }, []);

  return (
    <React.Fragment>
      <div className="filterContainer">
        <InputField
          label={t('paymentInvoices.paymentMethods.cards.filter.search.label')}
          placeholder={t('paymentInvoices.paymentMethods.filter.search.placeholder')}
          onInputChange={(event) => {
            filterCreditCards(event.target.value);
          }}
          useRegister={false}
        />
      </div>
      <CreditCardsTable />
    </React.Fragment>
  );
}
