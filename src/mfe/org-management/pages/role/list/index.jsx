import React, { useEffect, useMemo } from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle.svg';
import ModuleHeader from '@src/components/module-header';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import RoleList from './RoleList';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { PATHS } from '../../../routes/constants';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import AuthUtils from '@src/util/AuthUtils';
import CommonFilters from '@src/components/Filters';
import Alert from '@src/components/cgat-alert/Alert';
import { useFilters } from '@src/context/TableContext';
import { useWidgetContext } from '@src/context/WidgetContext';

function Roles() {
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const userPermissions = AuthUtils.getUserPermissions();
  const { applyFilters, clearFilters } = useFilters();
  const [alert, setAlert] = React.useState(null);
  const { setValue } = useWidgetContext();

  const handleOnAddRoleClick = () => {
    setValue('roleDetails', null);
    setValue('createWizardSteps', {});
    navigate('create');
  };
  React.useEffect(() => {
    clearFilters();
    const { alert } = location.state || {};
    if (alert) {
      setAlert(alert);
      navigate(location.pathname, { replace: true });
    }
  }, [location.state]);

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dateRangePicker',
        name: 'dateRange',
        startDateLabel: t('labels.startDate'),
        endDateLabel: t('labels.endDate')
      },
      {
        type: 'dropdown',
        name: 'status',
        label: t('userManagement.table.status'),
        options: [
          { label: 'All', value: 'all' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Active', value: 'active' }
        ]
      }
    ];
  }, []);

  const breadcrumbItems = [
    {
      label: t('orgManagement.header.admin'),
      url: AuthUtils.isSystemAdminView() ? '/' : '/admin'
    },
    {
      label: t('orgManagement.role.headingManageOrder')
    }
  ];

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumb items={breadcrumbItems} />
      <div className="MCP-module-body">
        <ModuleHeader
          heading={<Heading as="h1">{t('orgManagement.role.headingManageOrder')}</Heading>}
          controls={
            userPermissions.includes(PERMISSIONS_ENUM.USER_MANAGEMENT.ADD_ROLES) && (
              <Button Icon={AddCircleFilled} size="md" onClick={handleOnAddRoleClick}>
                {t('orgManagement.role.labelAddRole')}
              </Button>
            )
          }
        />
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        {/* module body */}
        <div className="MCP-module-body">
          <div className="MCP-panel-container">
            <div className="MCP-CardContainer">
              <CommonFilters
                autoFocus={true}
                onApplyFilters={applyFilters}
                onClearFilters={clearFilters}
                additionalFilters={AdditionalFiltersConfig}
                searchPlaceholder={t('orgManagement.role.placeholder')}
              />
            </div>
            <div className="MCP-table-wrapper">
              <RoleList onAlert={setAlert} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Roles;
