import React from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import { useSPAccountContext } from '../../system-admin/manage-sp-account/context/SPAccountContext';
import SPAccountDataTable from '../../system-admin/manage-sp-account/pages/SPAccounts/SPAccountDataTable';

function ManageLinkedAccount() {
  const { t } = useTranslate();
  const { applyFilters, clearFilters } = useSPAccountContext();
  const additionalFiltersConfig = React.useMemo(() => {
    return [
      {
        type: 'dropdown',
        name: 'salesOrg',
        label: t('Sales Org'),
        options: [
          { label: 'All', value: '' },
          { label: 'MPB', value: 'MPB' },
          { label: '3PL', value: '3PL' },
          { label: 'SD', value: 'SD' },
          { label: 'NA', value: 'NA' }
        ]
      },
      {
        type: 'dropdown',
        name: 'distributionChannel',
        label: t('Distribution Channel'),
        options: [
          { label: 'All', value: 'ALL' },
          { label: 'Buy and Bill', value: 'BUY_AND_BILL' },
          { label: 'SP', value: 'SPECIALITY_PHARMA' }
        ]
      }
    ];
  }, []);
  const translatedBreadcrumbs = [
    {
      label: 'Admin',
      url: '/admin'
    },
    {
      label: 'dashboard.card.manage_linked_accounts'
    }
  ].map((item) => ({
    ...item,
    label: t(`${item.label}`)
  }));

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <div className="MCP-module-body">
        <Heading as="h1">{t('dashboard.card.manage_linked_accounts')}</Heading>
        <div className="MCP-panel-container">
          <div className="MCP-panel-container">
            <CommonFilters
              autoFocus={true}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={additionalFiltersConfig}
              searchPlaceholder={t('manageSPAccount.filters.searchPlaceholder')}
            />
          </div>
          <SPAccountDataTable isLinkedAccount={true} />
        </div>
      </div>
    </div>
  );
}
export default ManageLinkedAccount;
