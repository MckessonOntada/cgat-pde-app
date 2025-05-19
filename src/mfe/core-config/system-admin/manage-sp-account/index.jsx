import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import { useLocation, useNavigate } from 'react-router-dom';
import OrgAccountsSelect from '../manage-questionnaire/components/orgAccountSelection/OrgAccountsSelect';
import { useSPAccountContext } from './context/SPAccountContext';
import SPAccountDataTable from './pages/SPAccounts/SPAccountDataTable';

function ManageSPAccount() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { applyFilters, clearFilters, refetchSPAccountList } = useSPAccountContext();
  const location = useLocation();
  const isSuccess = location.state?.isSuccess || false;

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
      label: 'system_config_manage_spaccount'
    }
  ].map((item) => ({
    ...item,
    label: t(`dashboard.card.${item.label}`)
  }));

  useEffect(() => {
    if (isSuccess) {
      refetchSPAccountList();
    }
  }, [location.pathname, location.state, navigate]);

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <div className="MCP-module-body">
        <Heading as="h1">{t('manageSPAccount.heading')}</Heading>

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
