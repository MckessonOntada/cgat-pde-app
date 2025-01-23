import React from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as AddCircleIcon } from '@src/assets/svg/add-circle.svg';

function ManageQuestionnaire() {
  const { t } = useTranslate();
  const breadcrumbItems = [
    {
      label: 'System administrator',
      url: '/orders/admin'
    },
    {
      label: 'System Configuration',
      url: '/orders/system-configuration'
    },
    {
      label: 'Questionnaire Builder'
    }
  ];
  return (
    <div>
      <div className="MCP-module-wrapper">
        <div className="MCP-module-header">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="MCP-module-body">
          <div className="row-space-between-center">
            <div className="styled-heading">
              <Heading as="h1">{t('heading.manageQuestionnaire')}</Heading>
            </div>
            <Button variant="primary" size="md" Icon={AddCircleIcon}>
              {t('button.caption.addQuestionnaire')}
            </Button>
          </div>

          <div className="MCP-CardContainer"></div>
        </div>
      </div>
    </div>
  );
}

export default ManageQuestionnaire;
