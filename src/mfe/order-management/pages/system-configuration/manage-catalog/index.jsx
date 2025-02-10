import React from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import CatalogDataTable from './pages/CatalogDataTable';
import CommonFilters from '@src/components/Filters';
import './manageCatalog.scss';
import OrgAccountsSelect from '../../../components/orgAccountSelection/OrgAccountsSelect';
import { CatalogProvider, useCatalogContext } from './context/CatalogContext';
import ViewConfiguration from './pages/viewConfiguration/ViewConfiguration';

function ManageCatalog(props) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, filterConfig } = useCatalogContext();

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
    <div className="MCP-module-wrapper catalog-module">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <div className="MCP-module-body">
        <Heading as="h1">{t('dashboard.card.manage_catalog')}</Heading>
        <div className="MCP-panel-container">
          <OrgAccountsSelect handleAccountChange={() => {}} />
          <div class="MCP-panel-container">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={t('ManageCatalog.SearchByMaterialId')}
              actualData={[]}
              initialData={filterConfig}
            />
          </div>
          <CatalogDataTable />
        </div>
      </div>
    </div>
  );
}
export default ManageCatalog;
