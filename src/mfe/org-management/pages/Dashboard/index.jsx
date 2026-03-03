import { Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/constants';
import './index.scss';
import { OrgProvider, useOrg } from '../../context/OrgContext';
import OrgList from './OrgList';
import CommonFilters from '@src/components/Filters';
import { US_STATES } from '@src/components/form/util';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';
import Alert from '@src/components/cgat-alert/Alert';
import AuthUtils from '@src/util/AuthUtils';

function DashboardPage() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const isSuccess = location.state?.isSuccess || false;
  const [alertDescription, setAlertDescription] = React.useState('');
  const [alert, setAlert] = React.useState(null);
  const [isDeactivate, setIsDeactivate] = React.useState(false);
  const { hasPermission } = usePermission();
  const { applyFilters, clearFilters } = useOrg();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const [statesList, setStatesList] = useState([]);
  const [statusList, setStatusList] = useState([
    { label: 'All', value: 'all' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Active', value: 'active' }
  ]);

  useEffect(() => {
    let _options = US_STATES();
    _options.unshift({
      isDisabled: true,
      value: '',
      label: t('orgManagement.create_org.option.please_select')
    });
    setStatesList(_options);
  }, []);

  const breadcrumbItems = [
    {
      label: isSystemAdminView ? 'System Administrator' : `${t('orgManagement.header.admin')}`,
      url: isSystemAdminView ? '/system-admin/home' : 'admin'
    },
    {
      label: `${t('orgManagement.header.label')}`
    }
  ];

  React.useEffect(() => {
    if (isSuccess) {
      setIsAlertVisible(true);
      setAlert({ type: 'success' });
      setAlertDescription('Organization Created Successfully');
    }
  }, [isSuccess, location.pathname, location.state]);

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    navigate(location.pathname, {
      replace: true,
      state: { ...location.state, isSuccess: false }
    });
  };

  const handlealert = (success, message) => {
    setIsAlertVisible(true);
    setIsDeactivate(true);
    if (success) {
      setAlert({ type: 'success' });
      setAlertDescription(message);
    } else {
      setAlert({ type: 'error' });
      setAlertDescription(message);
    }
  };

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'location',
        label: `${t('orgManagement.table.location')}`,
        options: statesList,
        getUpdatedOptions: (e) => {
          if (e.length > 0) {
            setStatesList(e);
          }
        }
      },
      {
        type: 'multiSelectDropdown',
        name: 'status',
        label: `${t('orgManagement.table.status')}`,
        options: statusList,
        getUpdatedOptions: (e) => {
          if (e.length > 0) {
            setStatusList(e);
          }
        }
      }
    ];
  }, [statesList]);

  const clearOptions = () => {
    setStatesList((prev) => {
      return prev.map((ele) => ({ ...ele, isChecked: false }));
    });
    setStatusList((prev) => {
      return prev.map((ele) => ({ ...ele, isChecked: false }));
    });
  };

  return (
    <div className="MCP-module-wrapper organization-module">
      <Breadcrumb items={breadcrumbItems} />
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('orgManagement.header.label')}</Heading>}
          controls={
            <div className="controls">
              {hasPermission(PERMISSIONS_ENUM.ORGANIZATION_MANAGEMENT.ADD_ORGANIZATION) && (
                <Button Icon={add_circle_bold} className="button-icon" variant="primary" size="md" onClick={() => navigate(`${PATHS.createOrg}`)}>
                  {t('orgManagement.add.label')}
                </Button>
              )}
            </div>
          }
        />
        {(isSuccess || isDeactivate) && isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type={alert.type} />}

        <div className="MCP-module-body">
          <div className="MCP-panel-container">
            <div className="MCP-CardContainer">
              <CommonFilters
                autoFocus={true}
                onApplyFilters={applyFilters}
                onClearFilters={() => {
                  clearFilters();
                  clearOptions();
                }}
                additionalFilters={AdditionalFiltersConfig}
                searchPlaceholder={t('orgManagement.org.placeholder')}
              />
            </div>
            <OrgList onActionSuccess={handlealert} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <OrgProvider>
      <DashboardPage />
    </OrgProvider>
  );
}
