import React, { useState, useEffect } from 'react';
import { TabList, Alert, Button } from '@mckesson/mcp-component-library';
import './index.scss';
import Filters from './Filters';
import { PATHS } from '../../routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { UserProvider } from '../../context/PageContext';
import UserTable from './UserTable';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import { debugIds, ID } from '@src/common/constants/id';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { ReactComponent as upload_bottom } from '@src/assets/image/upload_bottom.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import ModuleHeader from '../../../../components/module-header';

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
      label: 'Dashboard',
      url: '/'
    },
    {
      label: 'Manage Users'
    }
  ];

  const buttonLabels = {
    add: t('userManagement.add.label'),
    upload: t('userManagement.upload.label')
  };
  const handlOnClick = () => {

  }
  return (
    <div className="MCP-module-wrapper" id={debugIds(ID.TABLE, ID.CONTAINER)}>
      <Breadcrumb items={breadcrumbItems} />
      <ModuleHeader
        heading={<p className='primaryHeading'>{t('userManagement.header.label')}</p>}
        controls={
          <div className="controls">
            <Button Icon={add_circle_bold} className="button-icon" variant="primary" size="md" onClick={() => navigate(`${PATHS.createUser}`)}>Add User</Button>
            <Button Icon={upload_bottom} className="button-icon" variant="primary" size="md" >Upload Users</Button>
          </div>
        }
      />
      {isSuccess && isAlertVisible && (
        <Alert
          description="Organization User has been successfully created."
          onClose={handleAlertClose}
          type="success"
          duration={10000}
        />)}
      <UserProvider>
        <div className="MCP-panel-container" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
          <Filters showRoleDropdown={true} showStatusDropdown={true} />
          <p className='secondaryHeading'> User Listing</p>
          <TabList
            options={tabs}
            alignment="left"
            onTabClick={handleTabClick}
            showShadow={false}
            variant={'text'}
            useAsButton={true}
          />
          <div className="userList">
            {activeTab === 'ACTIVE USERS' && <UserTable selectableRows={true} />}
            {activeTab === 'PENDING REQUESTS' && <UserTable selectableRows={false} omitColumns={['role']} isPendingRequest={true} />}
          </div>
        </div>
      </UserProvider>
    </div>
  );
}
