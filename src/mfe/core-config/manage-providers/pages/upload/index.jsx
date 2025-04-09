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
import { Provider } from 'react-redux';
import ProviderService from '@src/api/commonService/ProviderService';

const downloadCSV = (data) => {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'sample_data.csv');
  link.click();
};

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
          const downloadErrorFile = () => downloadCSV(response.data);
          add({
            type: 'success',
            description: (
              <div className="alert-controls">
                <p>{t('providers.message.fileUploadSuccess')}</p>
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
        add({ type: 'error', description: errorResponse.data.message });
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
        onAlertClose={() => {}}
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
