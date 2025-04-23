import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import UploadFile from '@src/components/uploadFile/UploadFile';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import ContextMenu from '@src/mfe/core-config/manage-sp-catalog/pages/context-menu';
import SPCrosswalkService from '@src/api/commonService/SPCrosswalkService';
import {
  handleDownload,
  validateFile
} from '@src/components/uploadFile/uploadUtils';
import { useNavigate } from 'react-router-dom';
import CommonUtils from '@src/util/CommonUtils';

const DOWNLOAD_CONTEXT_OPTIONS = {
  DOWNLOAD_TEMPLATE: 'Download Template',
  DOWNLOAD_SP_PRODUCT_INFO: 'Download SP Product Info',
  DOWNLOAD_MATERIAL_INFO: 'Download Material Info'
};

const Upload = () => {
  const { t } = useTranslate();
  const { items, add, remove, removeAll } = useTimedArray(10000);
  const navigate = useNavigate();
  const handleOnUpload = (values) => {
    removeAll();
    const { file } = values;
    if (!file) {
      add({
        type: 'error',
        description: t('providers.errorMessage.fileUploadRequired')
      });
      return;
    }

    const formData = new FormData();
    formData.append('crossWalkData', file);

    SPCrosswalkService.uploadSPCrosswalk(formData)
      .then((response) => {
        if (response.status == 200) {
          add({
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
          add({
            type: 'info',
            description: (
              <div className="alert-controls">
                <p>{t('providers.message.fileUploadPartialSuccess')}</p>
                <div>
                  <Button
                    variant="secondary"
                    color="success"
                    onClick={downloadErrorFile}>
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
        if (errorResponse.data?.message) {
          add({
            type: 'error',
            description:
              errorResponse.data?.message ||
              t('providers.message.fileUploadFailure')
          });
        }
      });
  };

  const handleOnDownload = (option) => {
    switch (option) {
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_TEMPLATE: {
        handleDownload(
          '/templates/upload_sp_crosswalk_template.csv',
          'upload_sp_crosswalk_template.csv'
        );
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_SP_PRODUCT_INFO: {
        SPCrosswalkService.downloadAssetTemplate('SPECIALITY_PHARMA').then(
          (response) => {
            CommonUtils.downloadFile(
              new Blob([response.data], { type: 'text/csv;charset=utf-8;' }),
              'Product Info'
            );
          }
        );
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_MATERIAL_INFO: {
        SPCrosswalkService.downloadAssetTemplate('BUY_AND_BILL').then(
          (response) => {
            CommonUtils.downloadFile(
              new Blob([response.data], { type: 'text/csv;charset=utf-8;' }),
              'Material Info'
            );
          }
        );
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
          onClick={() => navigate('/admin/crosswalk')}
          size="md">
          {t('label.backSpCrosswalk')}
        </Button>
      </div>
      <UploadFile
        primaryHeading={t('controls.uploadMaterialCrosswalk')}
        controlHeading={t('heading.uploadMaterialCrosswalkListCSV')}
        isLoading={false}
        messages={items}
        customDownload={
          <ContextMenu
            items={Object.values(DOWNLOAD_CONTEXT_OPTIONS)}
            onSelect={handleOnDownload}>
            <Button
              size="md"
              variant={'secondary'}
              className="context-menu__button">
              {t('controls.downloadCSVTemplate')}
            </Button>
          </ContextMenu>
        }
        onAlertClose={() => {}}
        // downloadTemplate={{
        //   caption: t('controls.downloadCSVTemplate'),
        //   fn: handleOnDownloadTemplate
        // }}
        upload={{
          caption: t('controls.uploadMaterialCrosswalk'),
          fn: handleOnUpload
        }}
        onFileSelection={(file) => validateFile(file, ['text/csv'])}
        prefixChildren={true}></UploadFile>
    </div>
  );
};

export default Upload;
