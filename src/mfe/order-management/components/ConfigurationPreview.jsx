import React from 'react';
import { Button, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import QuestionnaireTemplate from '../questionnaire/QuestionnaireTemplate';
import { Form, Formik } from 'formik';

function ConfigurationPreview() {
  const { t } = useTranslate();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isMaterial = false,
    isCatalog = false,
    isAccount = false,
    questionnaire = [],
    isSPMaterial = false,
    isSPCatalog = false,
    isSPAccount = false
  } = location.state || false;

  const handleOnBackToQuestionnaire = () => {
    navigate(-1);
  };
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={handleOnBackToQuestionnaire} size="md">
          {isMaterial
            ? t('manageMaterial.BacktoPage')
            : isCatalog
            ? t('ManageCatalog.BacktoPage')
            : isAccount
            ? t('ManageAccount.BacktoPage')
            : isSPAccount
            ? t('manageSPAccount.btn.backToSpAccount')
            : isSPMaterial
            ? t('manageSPMaterial.BacktoPage')
            : isSPCatalog
            ? t('label.backSpCatalog')
            : ''}
        </Button>
      </div>
      <div className="row-space-between-center">
        <div className="styled-heading">
          <Heading as="h1">{t('labels.configurationPreview')}</Heading>
        </div>
      </div>
      <div className="MCP-panel-container ">
        <div className="row-space-between-center styled-heading">
          <Heading as="h3">{t('labels.additionalDetails')}</Heading>
          <p className="tertiaryHeading">
            <span className="required">*</span> {t('userManagement.create_user.required')}
          </p>
        </div>
        <Formik>
          <Form>
            <QuestionnaireTemplate config={questionnaire} isPreview={true} />
          </Form>
        </Formik>
      </div>
    </div>
  );
}

export default ConfigurationPreview;
