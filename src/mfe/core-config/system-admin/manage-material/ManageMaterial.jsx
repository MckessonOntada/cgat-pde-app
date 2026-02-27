import React, { useMemo, useState } from 'react';
import CommonFilters from '@src/components/Filters';
import styles from './assets/styles/ManageMaterial.module.scss';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useManageMaterial } from '@src/mfe/core-config/system-admin/manage-material/context/ManageMaterialContext';
import ManageMaterialTable from './ManageMaterialTable';
import Alert from '@src/components/cgat-alert/Alert';
import { useLocation } from 'react-router-dom';

function ManageMaterial() {
  const { t } = useTranslate();
  const { actualData, applyFilters, clearFilters, refetch, setSelectedMaterials } = useManageMaterial();
  const [alert, setAlert] = useState(null);
  const location = useLocation();

  React.useEffect(() => {
    clearFilters();
    setSelectedMaterials([]);
    refetch();
    if (location.state?.alert?.type && location.state?.alert?.description) {
      setAlert({
        type: location.state.alert.type,
        description: location.state?.alert?.description
      });
    }
    window.history.replaceState({ ...location.state, alert: undefined }, document.title);
  }, [location, setAlert]);

  const breadcrumbItems = [
    {
      label: t('manageMaterial.breadcrumbs.systemAdministrator'),
      url: '/system-admin/home'
    },
    {
      label: t('manageMaterial.breadcrumbs.systemConfiguration'),
      url: '/system-admin/config'
    },
    {
      label: t('manageMaterial.breadcrumbs.manageMaterial')
    }
  ];

  const showAlert = (type, description) => {
    setAlert({ type, description });
  };

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="MCP-module-body">
        <Heading as="h1">{t('manageMaterial.heading')}</Heading>
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
        <div className={`${styles.cardContainer}`}>
          <div className={`${styles.cardContainer}`}>
            <CommonFilters
              autoFocus={true}
              additionalFilters={[]}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              searchPlaceholder={t('manageMaterial.filters.searchPlaceholder')}
              actualData={actualData}
            />
          </div>
          <ManageMaterialTable
            className={styles.manageMaterialTable}
            onSuccess={() => showAlert('success', t('manageMaterial.drawer.controls.apply.success'))}
            onError={() => showAlert('error', t('errors.default'))}
          />
        </div>
      </div>
    </div>
  );
}

export default ManageMaterial;
