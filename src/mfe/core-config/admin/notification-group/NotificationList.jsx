import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { Heading, Alert } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';
import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';

function NotificationList() {
  const { t: translateFn } = useTranslate();
  const [alert, setAlert] = React.useState(null);
  const breadcrumbItems = [
    {
      label: translateFn('userManagement.breadcrumb.admin'),
      url: '/admin'
    },
    {
      label: translateFn('Manage Notification Group')
    }
  ];
  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-header">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="MCP-module-body">
          <ModuleHeader heading={<Heading as="h1">{translateFn('Manage Notification Group')}</Heading>} />
        </div>
      </div>
      <div className="MCP-module-body">{alert && <Alert {...alert} onClose={() => setAlert(null)} />}</div>
      <div className="MCP-module-footer"></div>
    </div>
  );
}

export default NotificationList;
