import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { Button } from '@mckesson/mcp-component-library';
import { useNavigate } from 'react-router-dom';
import UploadFile from '@src/components/uploadFile/UploadFile';
import {
  handleDownload,
  validateFile
} from '@src/components/uploadFile/uploadUtils';
import ProviderService from '@src/api/commonService/ProviderService';
import { downloadFile } from '@src/util/CommonUtils';

const Upload = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const { items, add, remove } = useTimedArray(10000);
  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.admin'),
        url: isSystemAdminView ? '/' : '/admin'
      },
      {
        label: t('label.providers'),
        url: isSystemAdminView ? '/' : '/admin/providers'
      },
      {
        label: t('controls.addProviders')
      }
    ];
  }, [isSystemAdminView]);

  const handleOnUpload = (values) => {
    const { file } = values;
    if (!file) {
      add({
        type: 'error',
        description: t('providers.errorMessage.fileUploadRequired')
      });
      return;
    }

    const formData = new FormData();
    formData.append('providerData', file);

    ProviderService.uploadProvider(formData)
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
            downloadFile(blob, 'Provider_Upload_Log');
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
    handleDownload(
      '/templates/upload_providers_template.csv',
      'upload_providers_template.csv'
    );
  };

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <UploadFile
        primaryHeading={t('controls.uploadProviders')}
        controlHeading={t('heading.uploadProviderListCSV')}
        isLoading={false}
        messages={items}
        onCloseAlert={remove}
        downloadTemplate={{
          caption: t('controls.downloadCSVTemplate'),
          fn: handleOnDownloadTemplate
        }}
        upload={{
          caption: t('controls.uploadProviders'),
          fn: handleOnUpload
        }}
        onFileSelection={(file) => validateFile(file, ['text/csv'])}
        prefixChildren={true}></UploadFile>
    </div>
  );
};

export default Upload;
