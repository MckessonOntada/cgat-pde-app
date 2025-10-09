import React, { useMemo, useState } from 'react';
import CommonFilters from '@src/components/Filters';
import styles from './assets/styles/ManageMaterial.module.scss';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useManageMaterial } from '@src/mfe/core-config/system-admin/manage-material/context/ManageMaterialContext';
import ManageMaterialTable from './ManageMaterialTable';
import Alert from '@src/components/cgat-alert/Alert';

function ManageMaterial() {
  const { t } = useTranslate();
  const { actualData, applyFilters, clearFilters } = useManageMaterial();
  const [alert, setAlert] = useState(null);
  const breadcrumbItems = [
    {
      label: t('manageMaterial.breadcrumbs.systemAdministrator'),
      url: '/'
    },
    {
      label: t('manageMaterial.breadcrumbs.systemConfiguration'),
      url: '/system-admin/config'
    },
    {
      label: t('manageMaterial.breadcrumbs.manageMaterial')
    }
  ];

  const handleAlertClose = () => {
    setAlert({ type: null, message: null });
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
  };

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="MCP-module-body">
        <Heading as="h1">{t('manageMaterial.heading')}</Heading>
        {alert && alert.type && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} />}
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
