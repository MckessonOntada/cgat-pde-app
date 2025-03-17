import DiscardChangesModal from '@src/mfe/org-management/pages/role/manage/DiscardChangesModel';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Field, Formik, Form } from 'formik';
import { Button, Heading, Loader, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';

const UploadSPMaterial = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [modalSuccessCallback, setModalSuccessCallback] = React.useState(null);
  const handleNavigate = () => {
    if (modalSuccessCallback === 'list') {
      navigate('/orders/system-configuration/manage-spmaterial');
    }
  };
  const handleCancel = () => {
    navigate('/orders/system-configuration/manage-spmaterial');
  };
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('/orders/system-configuration/manage-spmaterial')}
          size="md">
          {t('manageSPMaterial.BacktoPage')}
        </Button>
      </div>
      <ModuleHeader heading={<Heading as="h1">{t('manageSPMaterial.heading.uploadspMaterial')}</Heading>} />
      <div className="MCP-panel-container"></div>
      <div className="buttonGroup">
        <Button variant="secondary" type="button" onClick={handleCancel} size="md">
          {t('manageSPMaterial.button.cancel')}
        </Button>

        <Button type="submit" size="md">
          {t('manageSPMaterial.heading.addSPMaterial')}
        </Button>
      </div>

      <DiscardChangesModal
        heading="Discard Changes"
        description="You have changed user details. Do you still want to go back? Your changes will be discarded!"
        isOpen={Boolean(modalSuccessCallback)}
        onClose={() => setModalSuccessCallback(null)}
        onConfirm={handleNavigate}
      />
    </div>
  );
};
export default UploadSPMaterial;
