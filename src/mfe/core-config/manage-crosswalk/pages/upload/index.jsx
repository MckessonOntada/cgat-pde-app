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
        prefixChildren={true}>
        <div>
          <Field
            id="upload-option"
            name="upload-option"
            caption={t('control.selectUploadOption')}
            placeholder=" "
            isRequired
            component={Components['radioGroup']}
            maxLength={50}
            direction="row"
            itemCustomStyles={{
              fontSize: '14px',
              marginRight: '24px',
              fontWeight: '400'
            }}
            items={[
              {
                label: t('label.uploadOption.full'),
                value: 'Full'
              },
              {
                label: t('label.uploadOption.partial'),
                value: 'Partial'
              }
            ]}
            labelCustomStyles={{ marginBottom: '8px', fontSize: '14px' }}
          />
          <div className="control-helper-text">
            {t('control.selectUploadOption.helperText')}
          </div>
        </div>
      </UploadFile>
    </div>
  );
};

export default Upload;
