import { Alert, Button, Heading } from '@mckesson/mcp-component-library';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATHS } from '../../routes/constants';
import Filters from './Filters';
import './index.scss';
import { OrgProvider } from '../../context/OrgContext';
import OrgList from './OrgList';

export default function Dashboard() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAlertVisible, setIsAlertVisible] = React.useState(false);
  const isSuccess = location.state?.isSuccess || false;
  const [alertDescription, setAlertDescription] = React.useState('');
  const breadcrumbItems = [
    {
      label: 'Dashboard',
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
              <Filters showLocationDropdown={true} showStatusDropdown={true} />
            </div>
            <Heading as="h2">{t('orgManagement.org_list')}</Heading>
            <OrgList />
          </div>
        </OrgProvider>
      </div>
    </div>
  );
}
