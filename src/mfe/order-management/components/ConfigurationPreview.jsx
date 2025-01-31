import React from 'react'
import { Button, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import {  useLocation, useNavigate } from 'react-router-dom';

function ConfigurationPreview() {
  const { t } = useTranslate();
  const location =useLocation();
  const navigate= useNavigate();
  const { isMaterial = false, isCatalog = false, isAccount = false, questionnaire =[]} = location.state || false; 
  
   const handleOnBackToQuestionnaire = () => {
     navigate(-1);
   };
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={handleOnBackToQuestionnaire}
          size="md">
          {isMaterial
            ? t('manageMaterial.BacktoPage')
            : isCatalog
            ? t('ManageCatalog.BacktoPage')
            : isAccount
            ? t('ManageAccount.BacktoPage')
            : ''}
        </Button>
      </div>
      <div className="row-space-between-center">
        <div className="styled-heading">
          <Heading as="h1">Configuration Preview</Heading>
        </div>
      </div>
    </div>
  );
} 

export default ConfigurationPreview