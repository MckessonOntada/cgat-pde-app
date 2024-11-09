import React from 'react';
import OrgList from './OrgList';
import Filters from './Filters';
import { OrganizationProvider } from '../../context/PageContext';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import PageHeader from './PageHeader';
import { PATHS } from '../../routes/constants';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';

export default function Dashboard() {
  const { t } = useTranslate();

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
    add: t('orgManagement.add.label')
  };

  return (
    <div className="orgContainer">
      <Breadcrumb items={breadcrumbItems} />
      <PageHeader
        title={t('orgManagement.header.label')}
        navigateTo={PATHS.dashboard}
        buttonLabels={buttonLabels}
      />
      <OrganizationProvider>
        <div className="orgCardContainer">
          <Filters showLocationDropdown={true} showStatusDropdown={true} />
          <h2 className="org-listing-label">Organization Listing</h2>
          <div className="orgList">
            <OrgList />
          </div>
        </div>
      </OrganizationProvider>
    </div>
  );
}
