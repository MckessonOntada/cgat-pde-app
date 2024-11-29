import React, { useEffect, useState } from 'react';
import OrgList from './OrgList';
import Filters from './Filters';
import { OrganizationProvider } from '../../context/OrgContext';
import './index.scss';
import { Button, Alert } from '@mckesson/mcp-component-library';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { PATHS } from '../../routes/constants';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import ModuleHeader from '@src/components/module-header';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const isSuccess = location.state?.isSuccess || false;
  const [alertDescription, setAlertDescription] = useState('');
  const breadcrumbItems = [
    {
      label: 'System administrator',
      url: '/'
    },
    {
      label: 'Manage Organization'
    }
  ];

  useEffect(() => {
    if (isSuccess) {
      setIsAlertVisible(true);
      setAlertDescription('Organization Created Successfully');
      const timer = setTimeout(() => {
        handleAlertClose;
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, location.pathname, location.state]);

  const handleAlertClose = () => {
    setIsAlertVisible(false);
    navigate(location.pathname, { replace: true, state: { ...location.state, isSuccess: false } });
  };

  return (
    <div className="orgContainer">
      <Breadcrumb items={breadcrumbItems} />

      <ModuleHeader
        heading={<p className="primaryHeading">{t('orgManagement.header.label')}</p>}
        controls={
          <div className="controls">
            <Button Icon={add_circle_bold} className="button-icon" variant="primary" size="md" onClick={() => navigate(`${PATHS.createOrg}`)}>
              {t('orgManagement.add.label')}
            </Button>
          </div>
        }
      />
      {isSuccess && isAlertVisible && <Alert description={alertDescription} onClose={handleAlertClose} type="success" duration={10000} />}

      <OrganizationProvider>
        <div className="orgCardContainer">
          <Filters showLocationDropdown={true} showStatusDropdown={true} />
          <h2 className="org-listing-label">{t('orgManagement.org_list')}</h2>
          <div className="orgList">
            <OrgList />
          </div>
        </div>
      </OrganizationProvider>
    </div>
  );
}
