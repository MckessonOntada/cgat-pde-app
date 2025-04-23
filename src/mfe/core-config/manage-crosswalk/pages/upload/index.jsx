import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import AuthUtils from '@src/util/AuthUtils';
import UploadFile from '@src/components/uploadFile/UploadFile';
import Components from '@src/components/form/Components';
import { Field } from 'formik';
import { Button } from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';

const Upload = () => {
  const { t } = useTranslate();
  const { items, add, remove } = useTimedArray(10000);

  const handleOnUpload = (values) => {};

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
        primaryHeading={t('controls.uploadMaterialCrosswalk')}
        controlHeading={t('heading.uploadMaterialCrosswalkListCSV')}
        isLoading={false}
        messages={items}
        onAlertClose={() => {}}
        downloadTemplate={{
          caption: t('controls.downloadCSVTemplate'),
          fn: handleOnDownloadTemplate
        }}
        upload={{
          caption: t('controls.uploadMaterialCrosswalk'),
          fn: handleOnUpload
        }}
        onFileSelection={(file) => console.log(`validating ${file.filename}`)}
        prefixChildren={true}></UploadFile>
    </div>
  );
};

export default Upload;
