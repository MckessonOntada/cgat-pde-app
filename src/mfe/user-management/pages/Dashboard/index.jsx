import React, { useState,useEffect } from 'react';
import { TabList,Alert } from '@mckesson/mcp-component-library';
import './index.scss';
import Filters from './Filters';
import { PATHS } from '../../routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { UserProvider } from '../../context/PageContext';
import UserTable from './UserTable'; 
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import { debugIds, ID } from '@src/common/constants/id';
import PageHeader from '@src/components/pageHeader';
import {  useLocation,useNavigate} from 'react-router-dom';

export default function Dashboard() {
  const { t } = useTranslate();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ACTIVE USERS');
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const location = useLocation();
  const isSuccess = location.state?.isSuccess || false;

  useEffect(() => {
    if (isSuccess) {
      setIsAlertVisible(true);

      // Set a timeout to auto-close the alert after 10 seconds
      const timer = setTimeout(() => {
        handleAlertClose
      }, 10000);   //This should be as same as duration that mentioed in Alert

      // Clear timeout if component unmounts or if isSuccess changes
      return () => clearTimeout(timer);
    }
  }, [isSuccess, location.pathname, location.state, navigate]);

  const handleAlertClose = () => {
    setIsAlertVisible(false); 
    navigate(location.pathname, { replace: true, state: { ...location.state, isSuccess: false } });
  }; 

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
      {isSuccess && isAlertVisible  &&(
      <Alert
        description="Organization User has been successfully created."
        onClose={handleAlertClose}
        type="success" 
        duration={10000}
      />)}
      <UserProvider>
        <div className="userCardContainer" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
          <Filters showRoleDropdown={true} showStatusDropdown={true} />
          <h1> User Listing</h1>
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
