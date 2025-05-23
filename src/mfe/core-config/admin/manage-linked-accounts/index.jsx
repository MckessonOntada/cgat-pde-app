import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import { useLocation, useNavigate } from 'react-router-dom';
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
          { label: 'All', value: 'all' },
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
          { label: 'All', value: 'all' },
          { label: 'BUY_AND_BILL', value: 'Buy and Bill' },
          { label: 'SPECIALITY_PHARMA', value: 'SP' }
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
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={additionalFiltersConfig}
              searchPlaceholder={t('manageSPAccount.filters.searchPlaceholder')}
            />
          </div>
          <SPAccountDataTable manageLinkedAccount={true} />
        </div>
      </div>
    </div>
  );
}
export default ManageLinkedAccount;
