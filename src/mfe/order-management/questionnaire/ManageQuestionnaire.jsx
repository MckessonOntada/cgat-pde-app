import React, { useState } from 'react';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as AddCircleIcon } from '@src/assets/svg/add-circle.svg';
import TemplateList from './TemplateList';
import { useLocation, useNavigate } from 'react-router-dom';

function ManageQuestionnaire() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const breadcrumbItems = [
    {
      label: 'System administrator',
      url: '/orders/admin'
    },
    {
      label: 'System Configuration',
      url: '/orders/system-configuration'
    },
    {
      label: 'Questionnaire Builder'
    }
  ];
  const { isMaterial = false, isCatalog = false, isAccount = false } = location.state || {};

  const checkSuccessFlag = isMaterial || isCatalog || isAccount;
  const getSuccessMessage = () => {
    if (isMaterial) return t('messages.confirmation.success_config_material');
    if (isCatalog) return t('messages.confirmation.success_config_catalog');
    if (isAccount) return t('messages.confirmation.success_config_account');
    return '';
  };

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertDescription, setAlertDescription] = useState('');
  const [alert, setAlert] = useState(null);

  const handleOnClick = () => {
    navigate('add');
  };

  React.useEffect(() => {
    if (checkSuccessFlag) {
      setIsAlertVisible(true);
      setAlertDescription(getSuccessMessage);
      setAlert({ type: 'success' });
    }
  }, [location.state, navigate]);

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    navigate(location.pathname, { replace: true, state: { ...location.state, isMaterial: false, isCatalog: false, isAccount: false } });
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
            <Button onClick={handleOnClick} variant="primary" size="md" Icon={AddCircleIcon}>
              {t('button.caption.addQuestionnaire')}
            </Button>
          </div>
          {isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type={alert.type} duration={10000} />}
          <div className="MCP-CardContainer">
            <TemplateList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageQuestionnaire;
