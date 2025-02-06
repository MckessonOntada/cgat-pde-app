import React, { useEffect, useMemo } from 'react';
import { Button, Alert, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle.svg';
import ModuleHeader from '@src/components/module-header';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import { useRole } from '../../../context/RoleContext';
import RolesDataTable from './RolesDataTable';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { PATHS } from '../../../routes/constants';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import AuthUtils from '@src/util/AuthUtils';
import CommonFilters from '@src/components/Filters';

function RolesList() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { messageConfig, clearMessage, clearFilters, applyFilters } = useRole();
  const userPermissions = AuthUtils.getUserPermissions();

  const handleOnAddRoleClick = () => {
    navigate(PATHS.createRole);
  };
  useEffect(() => {
    clearFilters();
  }, []);

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dateRangePicker',
        name: 'dateRange'
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
      {/* Breadcrumb */}
      <Breadcrumb className="module-breadcrumb" items={breadcrumbItems} />

      {/* module header */}
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

      {messageConfig.kind && messageConfig.primaryMessage && (
        <Alert duration={10000} onClose={clearMessage} description={messageConfig.primaryMessage} type={messageConfig.kind} />
      )}

      {/* module body */}
      <div className="MCP-module-body">
        <div className="MCP-panel-container">
          <div className="MCP-CardContainer">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={AdditionalFiltersConfig}
              searchPlaceholder={t('orgManagement.role.placeholder')}
            />
          </div>
          <div className="MCP-table-wrapper">
            <RolesDataTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RolesList;
