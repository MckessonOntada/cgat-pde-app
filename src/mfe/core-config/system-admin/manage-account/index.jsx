import React from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import AccountDataTable from './pages/AccountDataTable';
import CommonFilters from '@src/components/Filters';
import './manageAccount.scss';
import OrgAccountsSelect from '../manage-questionnaire/components/orgAccountSelection/OrgAccountsSelect';
import { useAccountContext } from './context/AccountContext';

function ManageAccount(props) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, filterConfig } = useAccountContext();

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
      label: 'manage_account'
    }
  ].map((item) => ({
    ...item,
    label: t(`dashboard.card.${item.label}`)
  }));

  return (
    <div className="MCP-module-wrapper Account-module">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <div className="MCP-module-body">
        <Heading as="h1">{t('ManageAccount.headings.manageAccount')}</Heading>
        <div className="MCP-panel-container">
          <OrgAccountsSelect handleAccountChange={() => {}} showAccountsSelect={false} />
          <div className="MCP-panel-container">
            <CommonFilters
              autoFocus={true}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={t('ManageAccount.controls.placeholder.Accounts.search')}
              actualData={[]}
              initialData={filterConfig}
            />
          </div>
          <AccountDataTable />
        </div>
      </div>
    </div>
  );
}
export default ManageAccount;
