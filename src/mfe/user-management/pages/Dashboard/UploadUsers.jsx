import React, { useState } from 'react';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { Button } from '@mckesson/mcp-component-library';
import { useUser } from '../../context/UserContext';
import CommonUtils from '@src/util/CommonUtils';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useNavigate } from 'react-router-dom';
import UploadFile from '@src/components/uploadFile/UploadFile.jsx';
import { buildUploadFormData, createAlertHandler, handleDownload, validateFile } from '@src/components/uploadFile/uploadUtils';
import ContextMenu from '@src/mfe/core-config/system-admin/manage-sp-catalog/pages/context-menu';

const DOWNLOAD_CONTEXT_OPTIONS = {
  DOWNLOAD_TEMPLATE: 'Download Template',
  DOWNLOAD__INFO: 'Download Instruction File'
};

function UploadUsers() {
  const navigate = useNavigate();
  const { refreshData } = useUser();
  const { t } = useTranslate();
  const [alert, setAlert] = useState(null);

  const showAlert = createAlertHandler(setAlert);
  const downloadTemplate = (option) => {
    switch (option) {
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_TEMPLATE: {
        handleDownload('/templates/upload_users_template.csv', 'upload_users_template.csv');
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD__INFO: {
        handleDownload('/templates/Instruction.txt', 'Instruction.txt');
        break;
      }
      default:
        return;
    }
  };
  const handleAlertClose = () => {
    setAlert(null);
  };
  const { mutate: uploadBulkUser, isLoading } = useMutation(
    async ({ url, payload }) => {
      return await HttpResourceService.callRest(url, httpVerb.POST, payload, {
        'Content-Type': 'multipart/form-data'
      });
    },
    {
      onSuccess: async (response) => {
        if (response.status === 200) {
          showAlert('success', t('userManagement.button.uploadSuccess'));
        } else if (response.status === 206) {
          const csvContent = response.data;
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const download = CommonUtils.downloadFile(blob, 'bulk users.csv');
          if (download.status === 'success') {
            showAlert('error', t('userManagement.button.uploadConflict'));
          } else {
            showAlert('error', t('userManagement.button.downloadFail'));
          }
        } else {
          showAlert('error', t('userManagement.button.uploadError'));
        }
        refreshData();
      },
      onError: () => {
        showAlert('error', t('userManagement.button.uploadError'));
      }
    }
  );

  const handleUpload = (values) => {
    if (!values.file) {
      showAlert('error', t('userManagement.button.uploadError'));
      return;
    }
    const url = `${ApiRoutes.USERS()}/upload?userType=GENERAL`;
    const formData = buildUploadFormData(values.file, 'userData');
    uploadBulkUser({ url, payload: formData });
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate(-1)} size="md">
          {t('userManagement.user.backmessage')}
        </Button>
      </div>
      <UploadFile
        primaryHeading={t('userManagement.uploadUsers')}
        controlHeading={t('userManagement.uploadUsersListCSV')}
        isLoading={isLoading}
        messages={[alert]}
        onCloseAlert={handleAlertClose}
        infoHeader={t('userManagement.upload-info')}
        customDownload={
          <ContextMenu items={Object.values(DOWNLOAD_CONTEXT_OPTIONS)} onSelect={downloadTemplate}>
            <Button size="md" variant={'secondary'} className="context-menu__button">
              {t('controls.downloadCSVTemplate')}
            </Button>
          </ContextMenu>
        }
        upload={{
          caption: t('userManagement.button.addUsers'),
          fn: handleUpload
        }}
        onFileSelection={(file) => validateFile(t, file, ['text/csv'])}
      />
    </div>
  );
}

export default UploadUsers;
