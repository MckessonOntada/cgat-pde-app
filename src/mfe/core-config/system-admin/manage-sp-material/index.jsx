import React, { useMemo } from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import SPMaterialDataTable from './pages/SPMaterialDataTable';
import ModuleHeader from '@src/components/module-header';
import { useSPMaterial } from './context/SPMaterialContext';

function ManageSPMaterial() {
  const { t } = useTranslate();
  const { applyFilters, clearFilters } = useSPMaterial();

  const translatedBreadcrumbs = [
    {
      label: 'systemAdministrator',
      url: '/admin'
    },
    {
      label: 'system_configuration',
      url: '/system-admin/config'
    },
    {
      label: 'system_config_manage_spmaterial'
    }
  ].map((item) => ({
    ...item,
    label: t(`dashboard.card.${item.label}`)
  }));

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dropdown',
        name: 'status',
        label: t('manageSPMaterial.table.status'),
        placeholder: t('placeholders.search'),
        options: [
          { label: 'All', value: 'all' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Active', value: 'active' }
        ]
      },
      {
        type: 'dropdown',
        name: 'manufacturer',
        label: t('manageSPMaterial.manufacturer'),
        placeholder: t('placeholders.search'),
        options: [
          { label: 'All', value: 'all' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Active', value: 'active' }
        ]
      }
    ];
  }, []);

  return (
    <div className="MCP-module-wrapper catalog-module">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('manageSPMaterial.heading')}</Heading>} />
        <div className="MCP-panel-container">
          <div className="MCP-panel-container">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={AdditionalFiltersConfig}
              searchPlaceholder={t('manageSPMaterial.filters.searchPlaceholder')}
            />
          </div>
          <SPMaterialDataTable />
        </div>
      </div>
    </div>
  );
}
export default ManageSPMaterial;
