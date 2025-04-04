import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import AuthUtils from '@src/util/AuthUtils';
import { Button } from '@mckesson/mcp-component-library';
import UploadFile from '@src/components/uploadFile/UploadFile';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';

const Upload = () => {
  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const { t } = useTranslate();
  const { items, add, remove } = useTimedArray(10000);
  const breadcrumbItems = React.useMemo(() => {
    return [
      {
        label: t('breadcrumb.systemAdmin'),
        url: isSystemAdminView ? '/' : '/admin'
      },
      {
        label: t('breadcrumb.systemConfiguration'),
        url: '/orders/system-configuration'
      },
      {
        label: t('label.materialCrosswalk'),
        url: '/admin/crosswalk'
      },
      {
        label: t('controls.uploadMaterialCrosswalk')
      }
    ];
  }, [isSystemAdminView]);

  const handleOnUpload = (values) => {
    add({
      description: 'This is sample alert message',
      type: 'success'
    });
  };
  const handleOnDownloadTemplate = () => {};

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
        onAlertClose={() => {}}
        downloadTemplate={{
          caption: t('controls.downloadCSVTemplate'),
          fn: handleOnDownloadTemplate
        }}
        upload={{
          caption: t('controls.uploadCatalog'),
          fn: handleOnUpload
        }}
        onFileSelection={(file) =>
          console.log(`validating ${file.filename}`)
        }></UploadFile>
    </div>
  );
};

export default Upload;
