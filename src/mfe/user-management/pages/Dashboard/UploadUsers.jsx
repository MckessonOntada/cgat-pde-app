import React, { useState, useEffect, useMemo } from 'react';
import './index.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useUser } from '../../context/UserContext';
import CommonUtils from '@src/util/CommonUtils';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';
import UploadUsersFile from '@src/components/uploadFileCsv/UploadUsersFile.jsx';

function UploadUsers() {
  const { showSnackbar } = useSnackbar();
  const { refreshData } = useUser();
  const { t } = useTranslate();
  const [alert, setAlert] = useState({ type: '', description: '', isAlertVisible: false });

  const showAlert = (type, message) => {
    setAlert({ type: type, description: message, isAlertVisible: true });
  
    const timer = setTimeout(() => {
      setAlert({ type: '', description: '', isAlertVisible: false });
    }, 10000);
  
    return () => clearTimeout(timer);
  };
  
  const handleAlertClose = () => {
    setAlert({ type: '', description: '', isAlertVisible: false });
  };
  

  const handleDownload = () => {
    const fileUrl = '/templates/upload_users_template.csv';
    fetch(fileUrl)
      .then((response) => response.blob())
      .then((blob) => {
        CommonUtils.downloadFile(blob, 'upload_users_template.csv');
      })
      .catch((error) => console.error('Error downloading file:', error));
  };

  const {
    mutate: uploadBulkUser,
    isLoading,
    isSuccess,
    data
  } = useMutation(
    async (data) => {
      const { url, payload, type } = data;
      return await HttpResourceService.callRest(url, httpVerb.POST, payload, {
        'Content-Type': 'multipart/form-data'
      });
    },
    {
      onSuccess: async (response, variables) => {
        if (response.status == 200) {
          showAlert('success', t('userManagement.button.uploadSuccess'));
        } else if (response.status == 206) {
          const csvContent = response.data;
          const blob = new Blob([csvContent], { type: 'text/csv' });
          let download = CommonUtils.downloadFile(blob, 'bulk users.csv');
          if (download.status == 'success') {
            showAlert('error', t('userManagement.button.uploadConflict'));
          } else {
            showSnackbar({ description: t('userManagement.button.downloadFail'), type: 'error' });
          }
        } else {
          showSnackbar({ description: t('userManagement.button.uploadError'), type: 'error' });
        }
        refreshData();
      },
      onError: (error) => {
        showSnackbar({ description: t('userManagement.button.uploadError'), type: 'error' });
      }
    }
  );
  const handleUpload = (value) => {
    if (!value.file) return;
    const url = `${ApiRoutes.USERS()}/upload?userType=GENERAL`;
    const formData = new FormData();
    formData.append('userData', value.file);
    uploadBulkUser({ url, payload: formData });
  };
  
  function validateFile(file) {
    const allowdTypes = ['text/csv'];

    if (!allowdTypes.includes(file.type)) {
      return { isValid: false, message: 'Unsupported file type. Please upload a valid file.' };
    }

    return { isValid: true, message: 'File is valid.' };
  }

  return (
    <React.Fragment>
      <UploadUsersFile 
        downloadTemplate={handleDownload} 
        handleUpload={handleUpload} 
        validateFile={validateFile} 
        label={t('lebal.users')}
        alert={alert}
        handleAlertClose={handleAlertClose}
      />
    </React.Fragment>
  );
}
export default UploadUsers;
