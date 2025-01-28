import React from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import CatalogDataTable from './pages/CatalogDataTable';
import CommonFilters from '@src/components/Filters';
import './manageCatalog.scss';
import OrgAccountsSelect from '../../../components/orgAccountSelection/OrgAccountsSelect';
import { CatalogProvider } from './context/CatalogContext';

function ManageCatalog(props) {
  const { t } = useTranslate();

  const translatedBreadcrumbs = [
    {
      label: 'systemAdministrator',
      url: '/admin'
    },
    {
      label: 'system_configuration',
      url: '/orders/system-configuration'
    },
    {
      label: 'manage_catalog'
    }
  ].map((item) => ({
    ...item,
    label: t(`dashboard.card.${item.label}`)
  }));

  return (
    <CatalogProvider>
      <div className="MCP-module-wrapper">
        <Breadcrumbs items={translatedBreadcrumbs} />
        <Heading as="h2">{t('dashboard.card.manage_catalog')}</Heading>
        <div className="MCP-panel-container">
          <OrgAccountsSelect handleAccountChange={() => {}} />
          <div class="MCP-CardContainer">
            <CommonFilters
              onApplyFilters={() => {}}
              onClearFilters={() => {}}
              additionalFilters={[]}
              searchPlaceholder={t('paymentInvoices.filter.search')}
              actualData={{}}
            />
          </div>
          <CatalogDataTable />
        </div>
      </div>
    </CatalogProvider>
  );
}
export default ManageCatalog;
