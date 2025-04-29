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
import CommonUtils, { downloadFile } from '@src/util/CommonUtils';

const DOWNLOAD_CONTEXT_OPTIONS = {
  DOWNLOAD_TEMPLATE: 'Download Template',
  DOWNLOAD_SP_PRODUCT_INFO: 'Download SP Product Info',
  DOWNLOAD_MATERIAL_INFO: 'Download Material Info'
};

const errorStatusCodes = [408, 500, 502, 503, 504];

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
            description: t('fileUpload.crosswalk.success')
          });
        } else if (response.status === 206) {
          const downloadErrorFile = () => {
            const blob = new Blob([response.data], {
              type: 'text/csv;charset=utf-8;'
            });
            downloadFile(blob, 'SP_Crosswalk_Upload_Log');
          };
          add({
            type: 'info',
            description: (
              <div className="alert-controls">
                <p>{t('fileUpload.crosswalk.partialSuccess')}</p>
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
        if (timeoutStatusCodes.includes(errorResponse.status)) {
          add({
            type: 'error',
            description: t('fileUpload.error.timeoutOrSystemError'),
            isSticky: true
          });
        } else if (errorResponse.data?.errorCodes) {
          errorResponse.data?.errorCodes.forEach((element) => {
            add({
              type: 'error',
              description: t(element),
              isSticky: true
            });
          });
        } else {
          add({
            type: 'error',
            description:
              errorResponse.data?.message ||
              t('providers.message.fileUploadFailure'),
            isSticky: true
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
        onCloseAlert={remove}
        upload={{
          caption: t('controls.uploadMaterialCrosswalk'),
          fn: handleOnUpload
        }}
        onFileSelection={(file) => validateFile(t, file, ['text/csv'])}
        prefixChildren={true}></UploadFile>
    </div>
  );
};

export default Upload;
