import { Heading } from '@mckesson/mcp-component-library';
import MaterialService from '@src/api/commonService/MaterialService';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import Alert from '@src/components/cgat-alert/Alert';
import CommonFilters from '@src/components/Filters';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import React, { useEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useSPMaterial } from './context/SPMaterialContext';
import SPMaterialDataTable from './pages/SPMaterialDataTable';

function ManageSPMaterial() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { applyFilters, clearFilters } = useSPMaterial();
  const [manufacturerList, setManufacturerList] = useState([]);
  const [alert, setAlert] = React.useState(null);
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
    setAlert({ type: null, message: null });
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
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

  return (
    <div className="MCP-module-wrapper catalog-module">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <button
        onClick={() =>
          navigate('diagnosis-code', {
            state: {
              selectedTherapy: {
                id: 997,
                name: 'Venetoclax',
                description: 'Water Do Not Use'
              }
            }
          })
        }>
        DX Config
      </button>
      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('manageSPMaterial.heading')}</Heading>} />
        {alert && alert.type && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} />}
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
          />
        </div>
      </div>
    </div>
  );
}
export default ManageSPMaterial;
