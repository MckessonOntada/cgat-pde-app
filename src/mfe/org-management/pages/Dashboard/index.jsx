import React from 'react';
import OrgList from './OrgList';
import Filters from './Filters';
import { OrganizationProvider } from '../../context/PageContext';
import { Button, Card } from '@mckesson/mcp-component-library';
import './index.scss';
import { useTranslation } from 'react-i18next';
import PageHeader from './pageHeader';
import { PATHS } from '../../routes/constants';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';

export default function Dashboard() {
  const { t } = useTranslation();

  const breadcrumbItems = [
    {
      label: 'System administrator',
      url: '/'
    },
    {
      label: 'Manage Organization'
    }
  ];

  const buttonLabels = {
    add: t('Add Organization')
  };

  return (
    <div className="orgContainer">
      <Breadcrumb items={breadcrumbItems} />
      <PageHeader
        title={t('Mange Organization')}
        navigateTo={PATHS.dashboard}
        buttonLabels={buttonLabels}
      />
      <OrganizationProvider>
        <div className="orgCardContainer">
          <Filters showLocationDropdown={true} showStatusDropdown={true} />
          <div className="orgList">
            <OrgList />
          </div>
        </div>
      </OrganizationProvider>
    </div>
  );
}
