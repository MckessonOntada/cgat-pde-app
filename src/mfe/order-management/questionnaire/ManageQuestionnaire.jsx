import React from 'react';
import { Heading, Button } from '@mckesson/mcp-component-library';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as AddCircleIcon } from '@src/assets/svg/add-circle.svg';
import TemplateList from './TemplateList';
import { useNavigate } from 'react-router-dom';

function ManageQuestionnaire() {
  const { t } = useTranslate();
  const navigate = useNavigate();
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

  const handleOnClick = () => {
    navigate('add');
  };

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
            <Button onClick={handleOnClick} variant="primary" size="md" Icon={AddCircleIcon}>
              {t('button.caption.addQuestionnaire')}
            </Button>
          </div>

          <div className="MCP-CardContainer">
            <TemplateList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageQuestionnaire;
