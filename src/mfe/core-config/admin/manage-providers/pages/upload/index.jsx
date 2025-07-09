import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { Button } from '@mckesson/mcp-component-library';
import UploadFile from '@src/components/uploadFile/UploadFile';
import { handleDownload, validateFile } from '@src/components/uploadFile/uploadUtils';
import ProviderService from '@src/api/commonService/ProviderService';
import CommonUtils, { downloadFile } from '@src/util/CommonUtils';
import ContextMenu from '@src/mfe/core-config/system-admin/manage-sp-catalog/pages/context-menu';

const DOWNLOAD_CONTEXT_OPTIONS = {
  DOWNLOAD_TEMPLATE: 'Download Template',
  DOWNLOAD_INFO: 'Download Instruction File'
};

const Upload = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const [alert, setAlert] = React.useState(null);
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

  const downloadTemplate = (option) => {
    switch (option) {
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_TEMPLATE: {
        handleDownload('/templates/upload_providers_template.csv', 'upload_providers_template.csv');
        break;
      }
      case DOWNLOAD_CONTEXT_OPTIONS.DOWNLOAD_INFO: {
        handleDownload('/templates/Provider_upload_instruction.txt', 'Provider_upload_instruction.txt');
        break;
      }
      default:
        return;
    }
  };

  const handleOnUpload = (values) => {
    setAlert(null);
    const { file } = values;
    if (!file) {
      setAlert({
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
          setAlert({
            type: 'success',
            description: t('providers.message.fileUploadSuccess')
          });
        } else if (response.status === 206) {
          const downloadErrorFile = () => {
            const blob = new Blob([response.data], {
              type: 'text/csv;charset=utf-8;'
            });
            downloadFile(blob, 'SP_Providers_Log.csv');
          };
          setAlert({
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
        const description = CommonUtils.getUploadErrorMessage(error, t);

        setAlert({
          type: 'error',
          description,
          isSticky: true
        });
      });
  };

  return (
    <div className="MCP-module-wrapper">
      <Breadcrumbs items={breadcrumbItems} />
      <UploadFile
        primaryHeading={t('controls.uploadProviders')}
        controlHeading={t('heading.uploadProviderListCSV')}
        isLoading={false}
        messages={[alert]}
        onCloseAlert={() => setAlert(null)}
        infoHeader={t('providers.upload-info')}
        customDownload={
          <ContextMenu items={Object.values(DOWNLOAD_CONTEXT_OPTIONS)} onSelect={downloadTemplate}>
            <Button size="md" variant={'secondary'} className="context-menu__button">
              {t('controls.downloadCSVTemplate')}
            </Button>
          </ContextMenu>
        }
        upload={{
          caption: t('controls.uploadProviders'),
          fn: handleOnUpload
        }}
        onFileSelection={(file) => validateFile(t, file, ['text/csv'])}
        prefixChildren={true}></UploadFile>
    </div>
  );
};

export default Upload;
