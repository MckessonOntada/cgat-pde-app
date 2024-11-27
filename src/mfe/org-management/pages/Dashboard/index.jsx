import React from 'react';
import OrgList from './OrgList';
import Filters from './Filters';
import { OrganizationProvider } from '../../context/OrgContext';
import './index.scss';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { useTranslate } from '@src/translations/useTranslation';
import { PATHS } from '../../routes/constants';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import ModuleHeader from '@src/components/module-header';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const breadcrumbItems = [
    {
      label: 'System administrator',
      url: '/'
    },
    {
      label: 'Manage Organization'
    }
  ];

  return (
    <div className="orgContainer">
      <Breadcrumb items={breadcrumbItems} />

      <ModuleHeader
        heading={<p className="primaryHeading">{t('orgManagement.header.label')}</p>}
        controls={
          <div className="controls">
            <Button
              Icon={add_circle_bold}
              className="button-icon"
              variant="primary"
              size="md"
              onClick={() => navigate(`${PATHS.createOrg}`)}>
              {t('orgManagement.add.label')}
            </Button>
          </div>
        }
      />

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
