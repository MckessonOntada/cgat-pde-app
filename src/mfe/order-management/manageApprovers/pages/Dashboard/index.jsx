import React, { useState, useEffect, useMemo } from 'react';
import { Alert, Button, Heading } from '@mckesson/mcp-component-library';
import './index.scss';
import { PATHS } from '../../routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import { debugIds, ID } from '@src/constants/id';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import CommonFilters from '@src/components/Filters';
import usePermission from '@src/hooks/usePermissions';
import ApproverList from './ApproverList';
import { useApprover } from '../../context/ApproverContext';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';

export default function Dashboard() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { clearFilters, applyFilters } = useApprover();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const location = useLocation();
  const { isSuccess = false } = location.state || {};
  const [alertDescription, setAlertDescription] = useState('');
  const [alert, setAlert] = useState(null);
  const { hasPermission } = usePermission();

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
      // refreshData();
      let message = t('approvergroup.messages.approvergroup_create_success');
      showAlert('success', message);
    }
  }, [isSuccess, location.pathname, location.state, navigate]);

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

  const breadcrumbItems = [
    {
      label: t('approvergroup.breadcrumb.labeldashboard'),
      url: '/'
    },
    {
      label: t('approvergroup.header.label')
    }
  ];

  const AdditionalFiltersConfig = useMemo(() => {
    let config = [];
    return [
      {
        type: 'multiSelectDropdown',
        name: 'status',
        label: t('userManagement.table.status'),
        options: [
          { label: 'All', value: 'all' },
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' }
        ]
      },
      {
        type: 'dateRangePicker',
        name: 'dateRange'
      }
    ];
  }, []);

  return (
    <div className="MCP-module-wrapper" id={debugIds(ID.TABLE, ID.CONTAINER)}>
      <Breadcrumb items={breadcrumbItems} />
      <ModuleHeader
        heading={<Heading as="h1">{t('approvergroup.header.label')}</Heading>}
        controls={
          <div className="controls">
            {hasPermission(PERMISSIONS_ENUM.ORDER_MANAGEMENT.MANAGE_ORDERS) && (
              <Button
                Icon={add_circle_bold}
                className="button-icon"
                variant="primary"
                size="md"
                onClick={() => navigate(`${PATHS.createapprovergroup}`)}>
                {t('approvergroup.create_approvergroup')}
              </Button>
            )}
          </div>
        }
      />
      {isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type={alert.type} duration={10000} />}

      <div className="MCP-panel-container" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
        <div className="MCP-panel-container">
          <CommonFilters
            onApplyFilters={applyFilters}
            onClearFilters={clearFilters}
            additionalFilters={AdditionalFiltersConfig}
            searchPlaceholder={t('approvergroup.searchFilter.label')}
          />
        </div>
        <Heading as="h2"> {t('approvergroup.table.listing.label')}</Heading>

        <div className="userList">
          <ApproverList selectableRows={true} onActionSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
}
