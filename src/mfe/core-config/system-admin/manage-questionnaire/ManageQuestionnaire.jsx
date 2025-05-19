import React, { useState } from 'react';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as AddCircleIcon } from '@src/assets/svg/add-circle.svg';
import TemplateList from './TemplateList';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEntityTypeFlags } from './util';
import { useQuestionnaire } from '../../../order-management/context/QuestionnaireContext';
import ModuleHeader from '@src/components/module-header';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';

function ManageQuestionnaire() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = usePermission();

  const breadcrumbItems = [
    {
      label: 'System administrator',
      url: '/'
    },
    {
      label: 'System Configuration',
      url: '/system-admin/config'
    },
    {
      label: 'Questionnaire Builder'
    }
  ];
  const { refetchTemplates } = useQuestionnaire();
  const selectedEntityType = location.state?.value || false;
  const isSuccess = location.state?.isSuccess || false;
  const { isMaterial, isCatalog, isAccount } = getEntityTypeFlags(selectedEntityType);
  const getSuccessMessage = () => {
    if (isMaterial) return t('messages.confirmation.success_config_material');
    if (isCatalog) return t('messages.confirmation.success_config_catalog');
    if (isAccount) return t('messages.confirmation.success_config_account');
    return '';
  };
  const [alertConfig, setAlertConfig] = useState(location.state?.alertConfig || null);

  const handleOnClick = () => {
    navigate('add');
  };

  React.useEffect(() => {
    if (location.state?.alertConfig) {
      setAlertConfig({ ...location.state.alertConfig });
    }
    if (location.state?.refetch) {
      refetchTemplates();
    }
    navigate(location.pathname, { replace: true, state: null });
  }, [navigate, location.pathname, location.state]);

  React.useEffect(() => {
    if (isSuccess) {
      setAlertConfig({
        isVisible: true,
        description: getSuccessMessage(),
        type: 'success'
      });
      refetchTemplates();
    }
  }, [location.state, navigate]);

  const handleAlertClose = () => {
    setAlertConfig(null);
    navigate(location.pathname, { replace: true, state: { ...location.state.value } });
  };

  return (
    <div>
      <div className="MCP-module-wrapper">
        <div className="MCP-module-header">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="MCP-module-body">
          <div className="row-space-between-center">
            <div className="styled-heading">
              <Heading as="h1">{t('heading.manageQuestionnaire')}</Heading>
            </div>
            {hasPermission(PERMISSIONS_ENUM.SYSTEM_CONFIGURATION.ADD_QUESTIONNAIRE) && (
              <Button onClick={handleOnClick} variant="primary" size="md" Icon={AddCircleIcon}>
                {t('button.caption.addQuestionnaire')}
              </Button>
            )}
          </div>
          {alertConfig && alertConfig.isVisible && (
            <Alert description={alertConfig.description} onClose={handleAlertClose} type={alertConfig.type} duration={10000} />
          )}
          <div className="MCP-CardContainer">
            <TemplateList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageQuestionnaire;
