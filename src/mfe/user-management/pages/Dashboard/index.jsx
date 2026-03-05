import React, { useState, useEffect, useMemo } from 'react';
import { TabList, Button, Heading } from '@mckesson/mcp-component-library';
import './index.scss';
import { PATHS } from '../../routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { useUser } from '../../context/UserContext';
import UserTable from './UserTable';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import { debugIds, ID } from '@src/constants/id';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import AuthUtils from '@src/util/AuthUtils';
import { PERMISSIONS_ENUM } from '../UserPermissions/permissionsEnum';
import CommonFilters from '@src/components/Filters';
import usePermission from '@src/hooks/usePermissions';
import { ReactComponent as UploadSVG } from '@src/assets/image/upload_bottom.svg';
import Alert from '@src/components/cgat-alert/Alert';
import { USER_TABS } from './constants';
import { useWidgetContext } from '@src/context/WidgetContext';

const getUserTabs = (t) => [
  {
    id: USER_TABS.USERS,
    configName: t('Table.Tabs.ActiveUser'),
    isActiveTab: false,
    sequence: 1,
    lableForMobile: 'ACTIVE USERS'
  },
  {
    id: USER_TABS.PENDING_REQUESTS,
    configName: t('Table.Tabs.pendingRequest'),
    isActiveTab: false,
    sequence: 2,
    lableForMobile: 'ACTIVE USERS'
  }
];

export default function Dashboard() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const { clearFilters, applyFilters, roleList, setPageNumber } = useUser();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const [alert, setAlert] = useState(null);
  const { hasPermission } = usePermission();
  const [tabList, setTabList] = React.useState(getUserTabs(t));
  const { reset } = useWidgetContext();
  const tab = params.get('tab');

  useEffect(() => {
    const nextParams = new URLSearchParams(location.search);
    let shouldNavigate = false;
    let nextState = location.state || null;

    let activeTab = tab;

    if (!tab) {
      activeTab = USER_TABS.USERS;
      nextParams.set('tab', USER_TABS.USERS);
      shouldNavigate = true;
    }

    setTabList((prev) =>
      prev.map((t) => ({
        ...t,
        isActiveTab: t.id === activeTab
      }))
    );

    const { alert } = location.state || {};
    if (alert) {
      setAlert(alert);
      nextState = null;
      shouldNavigate = true;
    }

    if (shouldNavigate) {
      navigate(`${location.pathname}?${nextParams.toString()}`, {
        replace: true,
        state: nextState
      });
    }
  }, [location.search, location.state, navigate]);

  const showAlert = (type, description) => {
    setAlert({
      type,
      description
    });
  };

  useEffect(() => {
    clearFilters();
  }, []);

  const handleSuccess = (isSuccess, description) => {
    const type = isSuccess ? 'success' : 'error';
    setAlert({ type, description });
  };

  const handleAlertClose = () => {
    setAlert(null);
    navigate(location.pathname, {
      replace: true,
      state: { ...location.state, isSuccess: false, isReject: false }
    });
  };

  const handleTabClick = (tab) => {
    setPageNumber(1);
    clearFilters();
    params.set('tab', tab.id);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleOnCreate = () => {
    reset();
    navigate(PATHS.CREATE);
  };

  const breadcrumbItems = [
    {
      label: isSystemAdminView ? 'System Administrator' : t('userManagement.breadcrumb.admin'),
      url: isSystemAdminView ? '/system-admin/home' : '/admin'
    },
    {
      label: isSystemAdminView ? t('userManagement.header.systemadminlisting.label') : t('userManagement.header.listing.label')
    }
  ];

  const AdditionalFiltersConfig = useMemo(() => {
    let config = [];
    if (tab === USER_TABS.USERS) {
      config.push(
        {
          type: 'dropdown',
          name: 'role',
          label: t('userManagement.table.role'),
          options: roleList
        },
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
        }
      );
    } else if (tab === USER_TABS.PENDING_REQUESTS) {
      config.push({
        type: 'dropdown',
        name: 'status',
        label: t('userManagement.table.status'),
        placeholder: t('placeholders.search'),
        options: [
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'PENDING' },
          { label: 'Rejected', value: 'REJECTED' }
        ],
        selected: 'PENDING'
      });
    }
    return [
      ...config,
      {
        type: 'dateRangePicker',
        name: 'dateRange',
        startDateLabel: isSystemAdminView ? t('labels.startDate') : t('labels.updatedDateFrom'),
        endDateLabel: isSystemAdminView ? t('labels.endDate') : t('labels.updatedDateTo')
      }
    ];
  }, [isSystemAdminView, roleList, location.search]);

  return (
    <div className="MCP-module-wrapper" id={debugIds(ID.TABLE, ID.CONTAINER)}>
      <Breadcrumb items={breadcrumbItems} />
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t(isSystemAdminView ? 'userManagement.header.systemadmin.label' : 'userManagement.header.label')}</Heading>}
          controls={
            <div className="controls">
              {hasPermission(PERMISSIONS_ENUM.USER_MANAGEMENT.ADD_USERS) && (
                <Button Icon={add_circle_bold} className="button-icon" variant="primary" size="md" onClick={handleOnCreate}>
                  {t(isSystemAdminView ? 'userManagement.button.addsystemadmin' : 'userManagement.button.adduser')}
                </Button>
              )}
              {!isSystemAdminView && hasPermission(PERMISSIONS_ENUM.USER_MANAGEMENT.UPLOAD_USERS) && (
                <div className="upload-userBtn">
                  <Button Icon={UploadSVG} className="button-icon" variant="primary" size="md" onClick={() => navigate(`${PATHS.UPLOAD}`)}>
                    <label htmlFor="fileInput">{t('userManagement.button.uploadUsers')}</label>
                  </Button>
                </div>
              )}
            </div>
          }
        />
        {alert && <Alert {...alert} onClose={handleAlertClose} />}
        <div className="MCP-panel-container" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
          <div className="MCP-CardContainer">
            <CommonFilters
              autoFocus={true}
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={AdditionalFiltersConfig}
              searchPlaceholder={t('userManagement.searchFilter.label')}
            />
          </div>

          {!isSystemAdminView && (
            <div className="customTab">
              <TabList options={tabList} alignment="left" onTabClick={handleTabClick} showShadow={false} variant={'text'} useAsButton={true} />
            </div>
          )}
          <div className="userList">
            <UserTable
              key={tab}
              showAlert={showAlert}
              selectableRows={tab === USER_TABS.USERS}
              onActionSuccess={tab === USER_TABS.USERS ? handleSuccess : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
