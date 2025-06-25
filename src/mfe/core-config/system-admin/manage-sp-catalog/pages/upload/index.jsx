import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import { Button } from '@mckesson/mcp-component-library';
import UploadFile from '@src/components/uploadFile/UploadFile';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { handleDownload, validateFile } from '@src/components/uploadFile/uploadUtils';
import SPCatalogService from '@src/api/commonService/SPCatalogService';
import CommonUtils, { downloadFile } from '@src/util/CommonUtils';
import ContextMenu from '../context-menu';
import { useNavigate } from 'react-router-dom';
import { errorStatusCodes } from '@src/util/ApiUtils';

const DOWNLOAD_CONTEXT_OPTIONS = {
  DOWNLOAD_TEMPLATE: 'Download Template',
  DOWNLOAD_SP_ACCOUNT_DATA: 'Download SP Account Data',
  DOWNLOAD_SP_MATERIAL_DATA: 'Download SP Material Data',
  DOWNLOAD__INFO: 'Download Instruction File'
};

const Upload = () => {
  const { t } = useTranslate();
  const [notification, setNotification] = React.useState(null);

  const navigate = useNavigate();
  const handleOnUpload = (values) => {
    setNotification(null);
    const { file } = values;
    if (!file) {
      setNotification({
        type: 'error',
        description: t('providers.errorMessage.fileUploadRequired')
      });
      return;
    }

    const formData = new FormData();
    formData.append('catalogsData', file);

    SPCatalogService.uploadCatalogData(formData)
      .then((response) => {
        if (response.status == 200) {
          setNotification({
            type: 'success',
            description: t('providers.message.fileUploadSuccess')
          });
        } else if (response.status === 206) {
          const downloadErrorFile = () => {
            const blob = new Blob([response.data], {
              type: 'text/csv;charset=utf-8;'
            });
            downloadFile(blob, 'SP_Catalog_Upload_Log');
          };
          setNotification({
            type: 'info',
            description: (
              <div className="alert-controls">
                <p>{t('providers.message.fileUploadPartialSuccess')}</p>
                <div>
                  <Button variant="secondary" color="success" onClick={downloadErrorFile}>
                    Download Report
                  </Button>
                </div>
              </div>
            ),
            isSticky: true
          });
        }
      })
      .catch((error) => {
        const { response: errorResponse = {} } = error;
        console.log('error', error);
        setNotification({
          type: 'error',
          description: t('errors.default'),
          isSticky: true
        });
      });
  };

  const handleOnDownload = (option) => {
    switch (option) {
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_TEMPLATE: {
        handleDownload('/templates/upload_sp_catalog.zip', 'Upload SP Catalog.zip');
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_SP_ACCOUNT_DATA: {
        SPCatalogService.downloadSPAccountTemplate().then((response) => {
          CommonUtils.downloadFile(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }), 'Accounts');
        });
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_SP_MATERIAL_DATA: {
        SPCatalogService.downloadSPMaterialTemplate().then((response) => {
          CommonUtils.downloadFile(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }), 'Material');
        });
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD__INFO: {
        handleDownload('/templates/Catalog_upload_instruction.txt', 'Catalog_upload_instruction.txt');
        break;
      }
      default:
        return;
    }
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => navigate('/system-admin/config/sp-catalog')}
          size="md">
          {t('label.backSpCatalog')}
        </Button>
      </div>
      <UploadFile
        primaryHeading={t('controls.uploadCatalog')}
        controlHeading={t('label.uploadCatalogListCSV')}
        infoHeader={t('label.uploadCatalog.info')}
        isLoading={false}
        messages={[notification]}
        onCloseAlert={() => setNotification(null)}
        customDownload={
          <ContextMenu items={Object.values(DOWNLOAD_CONTEXT_OPTIONS)} onSelect={handleOnDownload}>
            <Button size="md" variant={'secondary'} className="context-menu__button">
              {t('controls.downloadCSVTemplate')}
            </Button>
          </ContextMenu>
        }
        upload={{
          caption: t('controls.uploadCatalog'),
          fn: handleOnUpload
        }}
        onFileSelection={(file) => validateFile(t, file, ['text/csv'])}></UploadFile>
    </div>
  );
};

export default Upload;
