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
import ContextMenu from '../context-menu';
import { useNavigate } from 'react-router-dom';

const DOWNLOAD_CONTEXT_OPTIONS = {
  DOWNLOAD_TEMPLATE: 'Download Template',
  DOWNLOAD_SP_ACCOUNT_DATA: 'Download SP Account Data',
  DOWNLOAD_SP_MATERIAL_DATA: 'Download SP Material Data'
};

const Upload = () => {
  const { t } = useTranslate();
  const { items, add, removeAll, remove } = useTimedArray(10000);
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
        const { response: errorResponse = {} } = error;

        if (errorResponse.data?.errorCodes) {
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
          '/templates/upload_sp_catalog_template.csv',
          'upload_sp_catalog_template.csv'
        );
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_SP_ACCOUNT_DATA: {
        SPCatalogService.downloadAPAccountTemplate().then((response) => {
          CommonUtils.downloadFile(
            new Blob([response.data], { type: 'text/csv;charset=utf-8;' }),
            'Accounts'
          );
        });
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_SP_MATERIAL_DATA: {
        SPCatalogService.downloadAPMaterialTemplate().then((response) => {
          CommonUtils.downloadFile(
            new Blob([response.data], { type: 'text/csv;charset=utf-8;' }),
            'Material'
          );
        });
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
          onClick={() => navigate('/admin/sp-catalog')}
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
