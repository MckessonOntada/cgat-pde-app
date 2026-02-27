import { Heading } from '@mckesson/mcp-component-library';
import MaterialService from '@src/api/commonService/MaterialService';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import Alert from '@src/components/cgat-alert/Alert';
import CommonFilters from '@src/components/Filters';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useLocation } from 'react-router-dom';
import { useSPMaterial } from './context/SPMaterialContext';
import SPMaterialDataTable from './pages/SPMaterialDataTable';

function ManageSPMaterial() {
  const { t } = useTranslate();
  const location = useLocation();

  const { applyFilters, clearFilters } = useSPMaterial();
  const [manufacturerList, setManufacturerList] = useState([]);
  const [alert, setAlert] = React.useState(null);

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
      label: 'system_config_manage_spmaterial'
    }
  ].map((item) => ({
    ...item,
    label: t(`dashboard.card.${item.label}`)
  }));

  const { mutate: manufacturerFilterList } = useMutation(
    async () => {
      return MaterialService.getManufacturerListSPMaterial('ALL');
    },
    {
      onSuccess: (data) => {
        setManufacturerList(data);
      },
      onError: (error) => {
        console.error('Error fetching manufacturers:', error);
      }
    }
  );

  useEffect(() => {
    manufacturerFilterList();
  }, []);

  const handleAlertClose = () => {
    setAlert(null);
  };

  const showAlert = (type, description) => {
    setAlert({ type, description });
  };

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dropdown',
        name: 'status',
        label: t('manageSPMaterial.table.status'),
        placeholder: t('placeholders.search'),
        options: [
          { label: 'All', value: 'ALL' },
          { label: 'Inactive', value: 'INACTIVE' },
          { label: 'Active', value: 'ACTIVE' }
        ]
      },
      {
        type: 'dropdown',
        name: 'manufacturer',
        label: t('manageSPMaterial.manufacturer'),
        placeholder: t('placeholders.search'),
        options: manufacturerList.map((item) => ({
          label: item,
          value: item
        }))
      }
    ];
  }, [manufacturerList]);

  React.useEffect(() => {
    const { alert } = location.state || {};
    if (alert) {
      setAlert({ ...alert });
    }
  }, [location]);

  return (
    <div className="MCP-module-wrapper catalog-module">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('manageSPMaterial.heading')}</Heading>} />
        {alert && <Alert {...alert} onClose={handleAlertClose} />}
        <div className="MCP-panel-container">
          <div className="MCP-panel-container">
            <CommonFilters
              autoFocus={true}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={AdditionalFiltersConfig}
              searchPlaceholder={t('manageSPMaterial.filters.searchPlaceholder')}
            />
          </div>
          <SPMaterialDataTable
            onSuccess={() => showAlert('success', t('manageMaterial.drawer.controls.apply.success'))}
            onError={() => showAlert('error', t('errors.default'))}
            setAlert={setAlert}
          />
        </div>
      </div>
    </div>
  );
}
export default ManageSPMaterial;
