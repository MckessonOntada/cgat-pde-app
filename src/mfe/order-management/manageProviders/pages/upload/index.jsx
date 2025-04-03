import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import AuthUtils from '@src/util/AuthUtils';
import Breadcrumbs from '@src/components/breadCrumbs/Breadcrumbs';
import { useNavigate } from 'react-router-dom';
import UploadFile from '@src/components/uploadFile/UploadFile';

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
        label: t('breadcrumb.manageProvider'),
        url: isSystemAdminView ? '/' : '/admin/providers'
      },
      {
        label: t('breadcrumb.add_providers')
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
      <Breadcrumbs items={breadcrumbItems} />
      <UploadFile
        primaryHeading={t('Upload Providers')}
        controlHeading={'Upload Provider List CSV'}
        isLoading={false}
        messages={items}
        onAlertClose={() => {}}
        downloadTemplate={{
          caption: t('Download CSV Template'),
          fn: handleOnDownloadTemplate
        }}
        upload={{
          caption: t('upload providers'),
          fn: handleOnUpload
        }}
        onFileSelection={(file) => console.log(`validating ${file.filename}`)}
        prefixChildren={true}>
        <div>d</div>
      </UploadFile>
    </div>
  );
};

export default Upload;
