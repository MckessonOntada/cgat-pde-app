import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import AuthUtils from '@src/util/AuthUtils';
import { Button } from '@mckesson/mcp-component-library';
import UploadFile from '@src/components/uploadFile/UploadFile';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import {
  handleDownload,
  validateFile
} from '@src/components/uploadFile/uploadUtils';
import SPCatalogService from '@src/api/commonService/SPCatalogService';
import CommonUtils, { downloadFile } from '@src/util/CommonUtils';

const Upload = () => {
  const { t } = useTranslate();
  const { items, add, removeAll, remove } = useTimedArray(10000);

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
    formData.append('catalogsData', file);

    SPCatalogService.uploadCatalogData(formData)
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
        const { response: errorResponse } = error;
        add({
          type: 'error',
          description: 'providers.message.fileUploadFailure'
        });
      });
  };
  const handleOnDownloadTemplate = () => {
    Promise.all([
      SPCatalogService.downloadAPAccountTemplate(),
      SPCatalogService.downloadAPMaterialTemplate()
    ])
      .then(([accountTemplate, materialTemplate]) => {
        if (accountTemplate) {
          CommonUtils.downloadFile(
            new Blob([accountTemplate], { type: 'text/csv;charset=utf-8;' }),
            'Accounts'
          );
        }
        if (materialTemplate) {
          CommonUtils.downloadFile(
            new Blob([materialTemplate], { type: 'text/csv;charset=utf-8;' }),
            'Material'
          );
        }
        handleDownload(
          '/templates/upload_providers_template.csv',
          'upload_sp_catalog_template.csv'
        );
      })
      .catch((error) => {
        console.error('One or both API calls failed', error);
      });
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <IconArrowLeft />}
          onClick={() => {}}
          size="md">
          {t('label.backSpCatalog')}
        </Button>
      </div>
      <UploadFile
        primaryHeading={t('controls.uploadCatalog')}
        controlHeading={t('label.uploadCatalogListCSV')}
        isLoading={false}
        messages={items}
        onCloseAlert={remove}
        downloadTemplate={{
          caption: t('controls.downloadCSVTemplate'),
          fn: handleOnDownloadTemplate
        }}
        upload={{
          caption: t('controls.uploadCatalog'),
          fn: handleOnUpload
        }}
        onFileSelection={(file) =>
          validateFile(file, ['text/csv'])
        }></UploadFile>
    </div>
  );
};

export default Upload;
