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

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dropdown',
        name: 'channelType',
        label: t('Distribution Channel'),
        options: [
          { label: t('labels.BUY_AND_BILL'), value: t('labels.BUY_AND_BILL') },
          { label: t('labels.SP'), value: t('labels.SP') },
          { label: 'Both', value: 'ALL' }
        ]
      }
    ];
  }, []);

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
              additionalFilters={AdditionalFiltersConfig}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              searchPlaceholder={t('manageMaterial.filters.searchPlaceholder')}
              actualData={actualData}
            />
          </div>
          <ManageMaterialTable
            className={styles.manageMaterialTable}
            onSuccess={() => showAlert('success', t('manageMaterial.drawer.controls.apply.success'))}
            onError={() => showAlert('error', t('manageMaterial.drawer.controls.apply.error'))}
          />
        </div>
      </div>
    </div>
  );
}

export default ManageMaterial;
