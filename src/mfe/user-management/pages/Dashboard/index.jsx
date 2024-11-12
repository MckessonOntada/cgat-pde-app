import React, { useState } from 'react';
import { TabList } from '@mckesson/mcp-component-library';
import './index.scss';
import Filters from './Filters';
import { PATHS } from '../../routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { UserProvider } from '../../context/PageContext';
import UserTable from './UserTable'; 
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import { debugIds, ID } from '@src/common/constants/id';
import PageHeader from '@src/components/pageHeader';

export default function Dashboard() {
  const { t } = useTranslate();
  const [activeTab, setActiveTab] = useState('ACTIVE USERS');

  const handleTabClick = (tab) => {
    console.log('tab', tab);
    setActiveTab(tab.configName);
  };

  const tabs = [
    {
      id: 1,
      configName: 'ACTIVE USERS',
      isActive: true,
      isActiveTab: activeTab === 'ACTIVE USERS',
      sequence: 1,
      lableForMobile: 'ACTIVE USERS'
    },
    {
      id: 2,
      configName: 'PENDING REQUESTS',
      isActiveTab: activeTab === 'PENDING REQUESTS',
      isActive: true,

      sequence: 2,
      lableForMobile: 'ACTIVE USERS'
    }
  ];

  const breadcrumbItems = [
    {
      label: 'Admin',
      url: '/admin'
    },
    {
      label: 'Manage Users'
    }
  ];

  const buttonLabels = {
    add: t('userManagement.add.label'),
    upload: t('userManagement.upload.label')
  };

  return (
    <div className="dashboard-container" id={debugIds(ID.TABLE, ID.CONTAINER)}>
      <Breadcrumb items={breadcrumbItems} />
      <PageHeader
        title={t('userManagement.header.label')}
        navigateTo={PATHS.createUser}
        buttonLabels={buttonLabels}
      />

      <UserProvider>
        <div className="userCardContainer" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
          <Filters showRoleDropdown={true} showStatusDropdown={true} />
          <TabList
            options={tabs}
            alignment="left"
            onTabClick={handleTabClick}
            showShadow={false}
            variant={'text'}
            useAsButton={true}
          />
          <div className="userList">
          {activeTab === 'ACTIVE USERS' && <UserTable />}
          {activeTab === 'PENDING REQUESTS' && <UserTable />}
          </div>
        </div>
      </UserProvider>
    </div>
  );
}
