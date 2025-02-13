import React from 'react';
import ModuleHeader from '@src/components/module-header';
import { Heading, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

function EmptyUI({ isLoading, isEmpty }) {
  const { t } = useTranslate();

  if (isLoading) {
    return (
      <div className="MCP-module-wrapper">
        <ModuleHeader heading={<Heading as="h1">{t('paymentInvoices.header.managePayments')}</Heading>} />
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            height: '250px',
            justifyContent: 'center'
          }}>
          <Loader loaderText={t('paymentInvoices.dataLoading')} />
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="MCP-module-wrapper">
        <ModuleHeader heading={<Heading as="h1">{t('paymentInvoices.header.managePayments')}</Heading>} />
        <EmptyDataContainer
          image={''}
          heading={t('paymentInvoices.EmptyData.heading')}
          description={t('paymentInvoices.EmptyData.description')}
        />
      </div>
    );
  }
}
export default EmptyUI;
