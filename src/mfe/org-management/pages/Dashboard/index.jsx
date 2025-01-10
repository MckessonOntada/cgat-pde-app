import { Alert, Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/constants';
import './index.scss';
import { OrgProvider, useOrg } from '../../context/OrgContext';
import OrgList from './OrgList';
import CommonFilters from '@src/components/Filters';
import { US_STATES } from '@src/components/form/util';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import usePermission from '@src/hooks/usePermissions';
import AuthUtils from '@src/util/AuthUtils';

function DashboardPage() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const isSuccess = location.state?.isSuccess || false;
  const [alertDescription, setAlertDescription] = React.useState('');
  const { hasPermission } = usePermission();
  const { applyFilters, clearFilters } = useOrg();
  const breadcrumbItems = [
    {
      label: `${t('orgManagement.header.admin')}`,
      url: '/'
    },
    {
      label: `${t('orgManagement.header.label')}`
    }
  ];

  React.useEffect(() => {
    if (isSuccess) {
      setIsAlertVisible(true);
      setAlertDescription('Organization Created Successfully');
      const timer = setTimeout(handleAlertClose, 10000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, location.pathname, location.state]);

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    navigate(location.pathname, { replace: true, state: { ...location.state, isSuccess: false } });
  };

  const usStates = US_STATES();
  usStates.unshift({
    isDisabled: true,
    value: '',
    label: t('orgManagement.create_org.option.please_select')
  });

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'multiSelectDropdown',
        name: 'location',
        label: `${t('orgManagement.table.location')}`,
        options: usStates
      },
      {
        type: 'multiSelectDropdown',
        name: 'status',
        label: `${t('orgManagement.table.status')}`,
        options: [
          { label: 'All', value: 'all' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Active', value: 'active' }
        ]
      }
    ];
  }, [usStates]);

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumb items={breadcrumbItems} />

      <ModuleHeader
        heading={<Heading as="h1">{t('orgManagement.header.label')}</Heading>}
        controls={
          <div className="controls">
            {hasPermission(PERMISSIONS_ENUM.ORGANIZATION_MANAGEMENT.ADD_ORGANIZATION) && (
              <Button
                Icon={add_circle_bold}
                className="button-icon"
                variant="primary"
                size="md"
                onClick={() => navigate(`${PATHS.createOrg}`)}>
                {t('orgManagement.add.label')}
              </Button>
            )}
          </div>
        }
      />
      {isSuccess && isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type="success" duration={10000} />}

      <div className="MCP-module-body">
        <div className="MCP-panel-container">
          <div className="MCP-panel-container">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={AdditionalFiltersConfig}
              searchPlaceholder={t('orgManagement.org.placeholder')}
            />
          </div>
          <Heading as="h2">{t('orgManagement.org_list')}</Heading>
          <OrgList />
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
