import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import CommonUtils from '@src/util/CommonUtils';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import UploadFile from '@src/components/uploadFile/UploadFile.jsx';
import { buildUploadFormData, createAlertHandler, handleDownload, validateFile, handleAlertClose } from '@src/components/uploadFile/uploadUtils';

const UploadSPMaterial = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ type: '', description: '', isAlertVisible: false });
  const showAlert = createAlertHandler(setAlert);
  const downloadTemplate = () => handleDownload('/templates/upload_users_template.csv', 'upload_users_template.csv');

  const { mutate: UploadSPMaterial, isLoading } = useMutation(
    async ({ url, payload }) => {
      return await HttpResourceService.callRest(url, httpVerb.POST, payload, {
        'Content-Type': 'multipart/form-data'
      });
    },
    {
      onSuccess: async (response) => {
        if (response.status === 200) {
          showAlert('success', t('manageSPMaterial.messages.button.uploadSuccess'));
        } else if (response.status === 206) {
          const csvContent = response.data;
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const download = CommonUtils.downloadFile(blob, 'bulk users.csv');
          if (download.status === 'success') {
            showAlert('error', t('manageSPMaterial.messages.button.uploadConflict'));
          } else {
            showAlert('error', t('manageSPMaterial.messages.button.downloadFail'));
          }
        } else {
          showAlert('error', t('manageSPMaterial.messages.button.uploadError'));
        }
        //refreshData();
      },
      onError: () => {
        showAlert('error', t('manageSPMaterial.messages.button.uploadError'));
      }
    }
  );

  const handleUpload = (values) => {
    if (!values.file) {
      showAlert('error', t('manageSPMaterial.messages.button.requiredupload'));
      return;
    }
    const url = `${ApiRoutes.USERS()}/upload?userType=GENERAL`; //TODO
    const formData = buildUploadFormData(values.file, 'userData');
    UploadSPMaterial({ url, payload: formData });
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('/core-config/manage-sp-material')}
          size="md">
          {t('manageSPMaterial.BacktoPage')}
        </Button>
      </div>
      <UploadFile
        label={t('manageSPMaterial.heading.spmaterial')}
        subHeading={t('manageSPMaterial.heading.uploadspMaterialcsv')}
        isLoading={isLoading}
        alert={alert}
        showAlert={showAlert}
        handleAlertClose={handleAlertClose}
        downloadTemplate={downloadTemplate}
        handleUpload={handleUpload}
        validateFile={(file) => validateFile(t, file, ['text/csv'])}
      />
    </div>
  );
};
export default UploadSPMaterial;
