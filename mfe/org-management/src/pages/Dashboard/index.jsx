import React from 'react';
import OrgList from './OrgList';
import Filters from './Filters';
import { OrganizationProvider } from '../../context/PageContext';
import { Button, Card } from '@mckesson/mcp-component-library';
import './index.scss';
import { useTranslation } from 'react-i18next';

export default function () {
  const { t } = useTranslation();
  return (
    <div className="orgContainer">
      <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        <h1>{t('manage_organization')}</h1>
        <div className="addOrgBtn">
          <Button label={t('add_organization')} />
        </div>
      </div>
      <OrganizationProvider>
        <Card
          bodyContent={
            <div className="orgCardContainer">
              <Filters />
              <div className="orgList">
                <OrgList />
              </div>
            </div>
          }
        />
      </OrganizationProvider>
    </div>
  );
}
