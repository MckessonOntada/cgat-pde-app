import React, { useState, useEffect, useMemo } from 'react';
import { TabList, Alert, Button, Heading } from '@mckesson/mcp-component-library';
import './index.scss';
import { PATHS } from '../../routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { useUser } from '../../context/UserContext';
import UserTable from './UserTable';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import { debugIds, ID } from '@src/constants/id';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { ReactComponent as UploadSVG } from '@src/assets/image/upload_bottom.svg';
import { ReactComponent as DownloadSVG } from '@src/assets/svg/downloadArrow.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import AuthUtils from '@src/util/AuthUtils';
import { PERMISSIONS_ENUM } from '../UserPermissions/permissionsEnum';
import CommonFilters from '@src/components/Filters';
import usePermission from '@src/hooks/usePermissions';
import CommonUtils from '@src/util/CommonUtils';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';

export default function Dashboard() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { activeTab, setActiveTab, refreshData, clearFilters, applyFilters, roleList } = useUser();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const location = useLocation();
  const isSuccess = location.state?.isSuccess || false;
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const isReject = location.state?.isReject || false;
  const [alertDescription, setAlertDescription] = useState('');
  const [alert, setAlert] = useState(null);
  const { hasPermission } = usePermission();
  const [inputKey, setInputKey] = useState(0);
  const { showSnackbar } = useSnackbar();

  const showAlert = (type, message) => {
    setAlert({ type });
    setIsAlertVisible(true);
    setAlertDescription(message);
    const timer = setTimeout(() => {
      setIsAlertVisible(false);
      setAlert({ type: '', description: '' });
    }, 10000);

    // Cleanup the timer to prevent memory leaks
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (isSuccess) {
      refreshData();
      let message = isReject
        ? t('messages.pending_user_reject_success')
        : isSystemAdminView
        ? t('messages.sysadmin_create_success')
        : t('messages.user_create_success');
      showAlert('success', message);
    }
  }, [isSuccess, isReject, location.pathname, location.state, navigate]);

  useEffect(() => {
    clearFilters();
  }, []);

  const handleSuccess = (success, message) => {
    if (success) {
      setAlert({ type: 'success' });
      showAlert('success', message);
    } else {
      setAlert({ type: 'error', message });
    }
  };

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    navigate(location.pathname, { replace: true, state: { ...location.state, isSuccess: false, isReject: false } });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
  };

  const tabs = [
    {
      id: 1,
      configName: t('Table.Tabs.ActiveUser'),
      isActive: true,
      isActiveTab: activeTab === 1,
      sequence: 1,
      lableForMobile: 'ACTIVE USERS'
    },
    {
      id: 2,
      configName: t('Table.Tabs.pendingRequest'),
      isActiveTab: activeTab === 2,
      isActive: true,
      sequence: 2,
      lableForMobile: 'ACTIVE USERS'
    }
  ];

  const breadcrumbItems = [
    {
      label: t('userManagement.breadcrumb.admin'),
      url: isSystemAdminView ? '/' : '/admin'
    },
    {
      label: isSystemAdminView ? t('userManagement.header.systemadminlisting.label') : t('userManagement.header.listing.label')
    }
  ];

  const AdditionalFiltersConfig = useMemo(() => {
    let config = [];
    if (!isSystemAdminView) {
      config.push({
        type: 'dropdown',
        name: 'role',
        label: t('userManagement.table.role'),
        options: roleList
      });
    }
    return [
      ...config,
      {
        type: 'dropdown',
        name: 'status',
        label: t('userManagement.table.status'),
        placeholder: t('placeholders.search'),
        options: [
          { label: 'All', value: 'all' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Active', value: 'active' }
        ]
      },
      {
        type: 'dateRangePicker',
        name: 'dateRange',
        startDateLabel: t('labels.startDate'),
        endDateLabel: t('labels.endDate')
      }
    ];
  }, [isSystemAdminView, roleList]);

  const handleDownload = () => {
    const fileUrl = '/templates/upload_users_template.csv';
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        CommonUtils.downloadFile(blob, 'upload_users_template.csv');
      })
      .catch((error) => console.error('Error downloading file:', error));
  };

  const {
    mutate: uploadBulkUser,
    isLoading,
    data
  } = useMutation(
    async (data) => {
      const { url, payload, type } = data;
      return await HttpResourceService.callRest(url, httpVerb.POST, payload, {
        'Content-Type': 'multipart/form-data'
      });
    },
    {
      onSuccess: async (response, variables) => {
        if (response.status == 200) {
          showAlert('success', 'Organization user has been successfully created');
        } else if (response.status == 206) {
          const csvContent = response.data;
          const blob = new Blob([csvContent], { type: 'text/csv' });
          let download = CommonUtils.downloadFile(blob, 'bulk users.csv');
          if (download.status == 'success') {
            showAlert('error', 'Partial content received. Some data might be missing.');
          } else {
            showSnackbar({ description: 'Something went wrong while downloading users file', type: 'error' });
          }
        } else {
          showSnackbar({ description: 'Error while creating Organization users', type: 'error' });
        }
        refreshData();
      },
      onError: (error) => {
        showSnackbar({ description: 'Error while creating Organization users', type: 'error' });
      }
    }
  );

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const url = `${ApiRoutes.USERS()}/upload?userType=GENERAL`;
    const formData = new FormData();
    formData.append('userData', file);
    uploadBulkUser({ url, payload: formData, type: 'csv' });
    setInputKey(inputKey + 1);
  };

  return (
    <div className="MCP-module-wrapper" id={debugIds(ID.TABLE, ID.CONTAINER)}>
      <Breadcrumb items={breadcrumbItems} />
      <ModuleHeader
        heading={
          <Heading as="h1">{t(isSystemAdminView ? 'userManagement.header.systemadmin.label' : 'userManagement.header.label')}</Heading>
        }
        controls={
          <div className="controls">
            {hasPermission(PERMISSIONS_ENUM.USER_MANAGEMENT.ADD_USERS) && (
              <Button
                Icon={add_circle_bold}
                className="button-icon"
                variant="primary"
                size="md"
                onClick={() => navigate(`${PATHS.createUser}`)}>
                {t(isSystemAdminView ? 'userManagement.button.addsystemadmin' : 'userManagement.button.adduser')}
              </Button>
            )}
            {!isSystemAdminView && hasPermission(PERMISSIONS_ENUM.USER_MANAGEMENT.UPLOAD_USERS) && (
              <React.Fragment>
                <div className="">
                  <input type="file" key={inputKey} id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} />
                  <Button Icon={UploadSVG} className="button-icon" variant="primary" size="md" onClick={(e) => e.stopPropagation()}>
                    <label htmlFor="fileInput">{t('userManagement.button.uploadUsers')}</label>
                  </Button>
                </div>
                <Button Icon={DownloadSVG} className="button-icon" variant="secondary" onClick={handleDownload} size="md">
                  {t('userManagement.button.downloadTemplate')}
                </Button>
              </React.Fragment>
            )}
          </div>
        }
      />
      {isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type={alert.type} duration={10000} />}
      <div className="MCP-panel-container" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
        <div className="MCP-CardContainer">
          <CommonFilters
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            additionalFilters={AdditionalFiltersConfig}
            searchPlaceholder={t('userManagement.searchFilter.label')}
          />
        </div>

        {!isSystemAdminView && (
          <TabList options={tabs} alignment="left" onTabClick={handleTabClick} showShadow={false} variant={'text'} useAsButton={true} />
        )}
        <div className="userList">
          {activeTab === 1 && <UserTable selectableRows={true} onActionSuccess={handleSuccess} />}
          {activeTab === 2 && <UserTable selectableRows={false} />}
        </div>
      </div>
    </div>
  );
}
