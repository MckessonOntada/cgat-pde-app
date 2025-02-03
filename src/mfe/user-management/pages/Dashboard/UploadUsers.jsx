import React, { useState, useEffect, useMemo } from 'react';
import { TabList, Alert, Button, Tooltip } from '@mckesson/mcp-component-library';
import './index.scss';
import { PATHS } from '../../routes/constants';
import { useTranslate } from '@src/translations/useTranslation';
import { useUser } from '../../context/UserContext';
import UserTable from './UserTable';
import Breadcrumb from '@src/components/breadCrumbs/Breadcrumbs';
import { debugIds, ID } from '@src/constants/id';
import { ReactComponent as add_circle_bold } from '@src/assets/image/add_circle_bold.svg';
import { ReactComponent as UploadSVG } from '@src/assets/image/upload_bottom.svg';
import { ReactComponent as DownloadSVG } from '@src/assets/svg/downloadArrow.svg';
import CommonUtils from '@src/util/CommonUtils';
import { useMutation } from 'react-query';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import useSnackbar from '@src/hooks/useSnackbar';

function UploadUsers({ showAlert }) {
  const [inputKey, setInputKey] = useState(0);
  const { showSnackbar } = useSnackbar();
  const { refreshData } = useUser();
  const { t } = useTranslate();

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

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const url = `${ApiRoutes.USERS()}/upload?userType=GENERAL`;
    const formData = new FormData();
    formData.append('userData', file);
    uploadBulkUser({ url, payload: formData, type: 'csv' });
    setInputKey(inputKey + 1);
  };
  return (
    <React.Fragment>
      <div className="upload-userBtn">
        <input type="file" key={inputKey} id="fileInput" onChange={handleFileChange} style={{ display: 'none' }} />
        <Button Icon={UploadSVG} className="button-icon" variant="primary" size="md" onClick={(e) => e.stopPropagation()}>
          <label htmlFor="fileInput">
            {isLoading ? t('userManagement.button.uploadingUsers') : t('userManagement.button.uploadUsers')}
          </label>
        </Button>
      </div>

      <Tooltip body={t('userManagement.button.downloadTemplateDescription')} title={t('userManagement.button.downloadTemplate')}>
        <div className="download-Icon" onClick={handleDownload}>
          <DownloadSVG />
        </div>
      </Tooltip>
    </React.Fragment>
  );
}
export default UploadUsers;
