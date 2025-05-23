import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs.jsx';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading } from '@mckesson/mcp-component-library';
import CommonFilters from '@src/components/Filters';
import { useLocation, useNavigate } from 'react-router-dom';

function ManageLinkedAccount() {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();

  const translatedBreadcrumbs = [
    {
      label: 'Admin',
      url: '/admin'
    },
    {
      label: 'Manage Linked Accounts'
    }
  ].map((item) => ({
    ...item,
    label: t(`${item.label}`)
  }));

  
  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={translatedBreadcrumbs} />
      <div className="MCP-module-body">
        <Heading as="h1">{t('Manage Linked Accounts')}</Heading>

        <div className="MCP-panel-container">
          <div className="MCP-panel-container">
      
          </div>
        </div>
      </div>
    </div>
  );
}
export default ManageLinkedAccount;
