import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import SPMaterialDataTable from './pages/SPMaterialDataTable';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { ReactComponent as UploadSVG } from '@src/assets/image/upload_bottom.svg';
import { routeConstants } from './routes/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSPMaterial } from './context/SPMaterialContext';

function ManageSPMaterial() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const location = useLocation();
  const isSuccess = location.state?.isSuccess || false;
  const { refreshData } = useSPMaterial();

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
      label: 'system_config_manage_spmaterial'
    }
  ].map((item) => ({
    ...item,
    label: t(`dashboard.card.${item.label}`)
  }));

  const showAlert = (type, message) => {
    setAlert({ type: type, message: message });
  };

  const handleSuccess = (success, message) => {
    if (success) {
      showAlert('success', message);
    } else {
      showAlert('error', message);
    }
  };

  const handleAlertClose = () => {
    setAlert({ type: null, message: null });
    navigate(location.pathname, { replace: true, state: { ...location.state, isSuccess: false } });
  };

  useEffect(() => {
    if (isSuccess) {
      refreshData();
      showAlert('success', t('manageSPMaterial.message.addsuccess'));
    }
  }, [isSuccess, location.pathname, location.state, navigate]);

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
      }
    ];
  }, []);

  return (
    <div className="MCP-module-wrapper catalog-module">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('manageSPMaterial.heading')}</Heading>}
          controls={
            <div className="controls">
              {
                <Button
                  Icon={add_circle_bold}
                  className="button-icon"
                  variant="primary"
                  size="md"
                  onClick={() => navigate(`${routeConstants.ADD_SPMATERIAL}`)}>
                  {t('manageSPMaterial.heading.addSPMaterial')}
                </Button>
              }
              {
                <Button
                  Icon={UploadSVG}
                  className="button-icon"
                  variant="primary"
                  size="md"
                  onClick={() => navigate(`${routeConstants.UPLOAD_SPMATERIAL}`)}>
                  {t('manageSPMaterial.heading.uploadspMaterial')}
                </Button>
              }
            </div>
          }
        />
        {alert && alert.type && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}
        <div className="MCP-panel-container">
          <div class="MCP-panel-container">
            <CommonFilters
              onApplyFilters={() => {}}
              onClearFilters={() => {}}
              additionalFilters={AdditionalFiltersConfig}
              searchPlaceholder={t('manageSPMaterial.filters.searchPlaceholder')}
              actualData={[]}
              initialData={[]}
            />
          </div>
          <SPMaterialDataTable onActionSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
export default ManageSPMaterial;
