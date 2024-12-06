import React, { useEffect } from 'react';
import { Button, Alert, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as AddCircleFilled } from '@src/assets/svg/add-circle.svg';
import ModuleHeader from '@src/components/module-header';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import FilterPanel from './FilterPanel';
import { useRole } from '../../../context/RoleContext';
import RolesDataTable from './RolesDataTable';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { PATHS } from '../../../routes/constants';

const breadcrumbItems = [
  {
    label: 'Dashboard',
    url: '/'
  },
  {
    label: 'Manage Roles'
  }
];

function RolesList() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { messageConfig, clearMessage, clearFilters } = useRole();
  const handleOnAddRoleClick = () => {
    navigate(PATHS.createRole);
  };
  useEffect(() => {
    clearFilters();
  }, []);
  return (
    <div className="MCP-module-wrapper">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* module header */}
      <ModuleHeader
        heading={<Heading as="h1">{t('orgManagement.role.headingManageOrder')}</Heading>}
        controls={
          <Button Icon={AddCircleFilled} size="md" onClick={handleOnAddRoleClick}>
            {t('orgManagement.role.labelAddRole')}
          </Button>
        }
      />

      {messageConfig.kind && messageConfig.primaryMessage && <Alert onClose={clearMessage} description={messageConfig.primaryMessage} type={messageConfig.kind} />}

      {/* module body */}
      <div className="MCP-module-body">
        <div className="MCP-panel-container">
          <div className="MCP-CardContainer">
            <FilterPanel />
          </div>
          <div className="MCP-table-wrapper">
            <ModuleHeader heading={<Heading as="h2">{t('orgManagement.role.labelRolesListing')}</Heading>} />
            <RolesDataTable />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RolesList;
