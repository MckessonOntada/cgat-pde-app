import React from 'react';
import CommonFilters from '@src/components/Filters';
import styles from './assets/styles/ManageMaterial.module.scss';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { useManageMaterial } from '@src/mfe/order-management/context/ManageMaterailContext';
import ManageMaterialTable from './ManageMaterialTable';

function ManageMaterial() {
  const { t } = useTranslate();
  const { actualData, applyFilters, clearFilters } = useManageMaterial();

  const breadcrumbItems = [
    {
      label: t('manageMaterial.breadcrumbs.systemAdministrator'),
      url: '/admin'
    },
    {
      label: t('manageMaterial.breadcrumbs.systemConfiguration'),
      url: '/admin/system-configuration'
    },
    {
      label: t('manageMaterial.breadcrumbs.manageMaterial'),
    }
  ];

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <Heading as="h2">{t('manageMaterial.heading')}</Heading>
      <div className={`MCP-CardContainer`}>
        <div className={`MCP-CardContainer`}>
          <CommonFilters
            additionalFilters={[]}
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            searchPlaceholder={t('manageMaterial.filters.searchPlaceholder')}
            actualData={actualData}
          />
        </div>
        <ManageMaterialTable className={styles.manageMaterialTable} />
      </div>
    </div>
  );
}

export default ManageMaterial;
