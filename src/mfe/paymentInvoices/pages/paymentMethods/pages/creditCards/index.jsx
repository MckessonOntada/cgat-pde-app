import React from 'react';
import CreditCardsTable from './CreditCardsTable';
import './index.scss';
import InputField from '@src/components/form/InputField';
import { useTranslate } from '@src/translations/useTranslation';

export default function CreditCards(params) {
  const { t } = useTranslate();
  return (
    <React.Fragment>
      <div className="filterContainer">
        <InputField
          label={t('paymentInvoices.paymentMethods.filter.search.label')}
          placeholder={t('paymentInvoices.paymentMethods.filter.search.placeholder')}
          form={{}}
          field={{ name: 'field' }}
          isDisabled={true}
        />
      </div>
      <div className="table-header">
        <h1>{t('paymentInvoices.paymentMethods.table.cards.heading')}</h1>
      </div>
      <CreditCardsTable />
    </React.Fragment>
  );
}
