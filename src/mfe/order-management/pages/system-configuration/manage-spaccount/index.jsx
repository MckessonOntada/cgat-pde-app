import React, { useEffect, useMemo, useState } from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';

import { routeConstants } from './routes/constants';
import { useLocation, useNavigate } from 'react-router-dom';
import OrgAccountsSelect from '../../../components/orgAccountSelection/OrgAccountsSelect';
import { useSPAccountContext } from './context/SPAccountContext';
import SPAccountDataTable from './pages/SPAccountDataTable';

function ManageSPAccount() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { applyFilters, clearFilters, filterConfig } = useSPAccountContext();

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
              actualData={[]}
              initialData={[]}
            />
          </div>
          <SPAccountDataTable />
        </div>
      </div>
    </div>
  );
}
export default ManageSPAccount;
