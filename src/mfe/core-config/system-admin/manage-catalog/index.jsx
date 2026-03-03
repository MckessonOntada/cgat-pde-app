import React, { useState } from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import CatalogDataTable from './pages/CatalogDataTable';
import CommonFilters from '@src/components/Filters';
import './manageCatalog.scss';
import OrgAccountsSelect from '../manage-questionnaire/components/orgAccountSelection/OrgAccountsSelect';
import { useCatalogContext } from './context/CatalogContext';
import Alert from '@src/components/cgat-alert/Alert';

function ManageCatalog(props) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, filterConfig } = useCatalogContext();
  const [alert, setAlert] = useState(null);

  const translatedBreadcrumbs = [
    {
      label: 'systemAdministrator',
      url: '/system-admin/home'
    },
    {
      label: 'system_configuration',
      url: '/system-admin/config'
    },
    {
      label: 'manage_catalog'
    }
  ].map((item) => ({
    ...item,
    label: t(`dashboard.card.${item.label}`)
  }));
  const handleAlertClose = () => {
    setAlert({ type: null, message: null });
  };
  const showAlert = (type, message) => {
    setAlert({ type, message });
  };
  return (
    <div className="MCP-module-wrapper catalog-module">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <div className="MCP-module-body">
        <Heading as="h1">{t('dashboard.card.manage_catalog')}</Heading>
        {alert && alert.type && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} />}
        <div className="MCP-panel-container">
          <OrgAccountsSelect handleAccountChange={() => {}} />
          <div className="MCP-panel-container">
            <CommonFilters
              autoFocus={true}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={t('ManageCatalog.SearchByMaterialId')}
              actualData={[]}
              initialData={filterConfig || {}}
            />
          </div>
          <CatalogDataTable showAlert={showAlert} />
        </div>
      </div>
    </div>
  );
}
export default ManageCatalog;
