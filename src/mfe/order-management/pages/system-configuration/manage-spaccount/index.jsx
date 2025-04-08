import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading, Alert } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import { useLocation, useNavigate } from 'react-router-dom';
import OrgAccountsSelect from '../../../components/orgAccountSelection/OrgAccountsSelect';
import { useSPAccountContext } from './context/SPAccountContext';
import SPAccountDataTable from './pages/SPAccounts/SPAccountDataTable';

function ManageSPAccount() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { applyFilters, clearFilters, refetchSPAccountList } = useSPAccountContext();

  const [alert, setAlert] = useState(null);
  const location = useLocation();
  const isSuccess = location.state?.isSuccess || false;

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
      label: 'system_config_manage_spaccount'
    }
  ].map((item) => ({
    ...item,
    label: t(`dashboard.card.${item.label}`)
  }));

  const showAlert = (type, message) => {
    setAlert({ type: type, message: message });
  };

  const handleAlertClose = () => {
    setAlert({ type: null, message: null });
    navigate(location.pathname, { replace: true, state: { ...location.state, isSuccess: false } });
  };

  useEffect(() => {
    if (isSuccess) {
      showAlert('success', t('manageSPAccount.message.addsuccess'));
      refetchSPAccountList();
    }
  }, [isSuccess, location.pathname, location.state, navigate]);

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <div className="MCP-module-body">
        <Heading as="h1">{t('manageSPAccount.heading')}</Heading>
        {alert && alert.type && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} duration={10000} />}
        <div className="MCP-panel-container">
          <OrgAccountsSelect handleAccountChange={() => {}} showAccountsSelect={false} />
          <div class="MCP-panel-container">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={t('manageSPAccount.filters.searchPlaceholder')}
            />
          </div>
          <SPAccountDataTable />
        </div>
      </div>
    </div>
  );
}
export default ManageSPAccount;
