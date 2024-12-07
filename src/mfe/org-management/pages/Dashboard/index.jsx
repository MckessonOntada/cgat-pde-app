import { Alert, Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/constants';
import Filters from './Filters';
import './index.scss';
import { OrgProvider } from '../../context/OrgContext';
import OrgList from './OrgList';
import CommonFilters from './../../../../components/Filters';
import { US_STATES } from '@src/components/form/util';

export default function Dashboard() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const isSuccess = location.state?.isSuccess || false;
  const [alertDescription, setAlertDescription] = React.useState('');
  const breadcrumbItems = [
    {
      label: 'System administrator',
      url: '/'
    },
    {
      label: 'Manage Organization'
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
    return [{
      type: 'dropdown',
      name: 'location',
      label: 'Location', // Use translation
      options: usStates
    },
    {
      type: 'dropdown',
      name: 'status',
      label: 'Status', // Use translation
      options: [{label: 'All', value: "all"}, { label: 'Inactive', value: "inactive"}, { label: "Active", value: 'active'}]
    }]
  },[usStates]);

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumb items={breadcrumbItems} />

      <ModuleHeader
        heading={<Heading as="h1">{t('orgManagement.header.label')}</Heading>}
        controls={
          <div className="controls">
            <Button Icon={add_circle_bold} className="button-icon" variant="primary" size="md" onClick={() => navigate(`${PATHS.createOrg}`)}>
              {t('orgManagement.add.label')}
            </Button>
          </div>
        }
      />
      {isSuccess && isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type="success" duration={10000} />}

      <div className="MCP-module-body">
        <OrgProvider>
          <div className="MCP-panel-container">
            <div className="MCP-panel-container">
              <CommonFilters 
                initialFilters={{ searchQuery: "" }} 
                onApplyFilters={(value) => console.log(value)} 
                onClearFilters={() => console.log('On clear filters')} 
                additionalFilters={AdditionalFiltersConfig}
              />
            </div>
            <Heading as="h2">{t('orgManagement.org_list')}</Heading>
            <OrgList />
          </div>
        </OrgProvider>
      </div>
    </div>
  );
}
