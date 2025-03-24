import React, { useState } from 'react';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import Components from '@src/components/form/Components';

function UploadUsersFile({downloadTemplate, handleUpload, validateFile, label, alert, handleAlertClose}) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <div className="MCP-module-wrapper">
        <div>
          <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate(-1)} size="md">
            {`${t('lebal.backToManage')} ${label}`}
          </Button>
        </div>
        <ModuleHeader
          heading={<Heading as="h1">{`Upload ${label}`}</Heading>}
          controls={
            downloadTemplate && (
                <div className="controls">
                  <Button className="button-icon" variant="secondary" size="md" onClick={downloadTemplate}>
                    {t('file.download.csv')}
                  </Button>
                </div>
            )
          }
        />
        {alert.isAlertVisible && <Alert description={alert.description} onClose={handleAlertClose} type={alert.type} />}
        <Formik
          initialValues={{ file: null }}
          onSubmit={(values, { setFieldValue }) => {
            handleUpload(values);
            setFieldValue('file', null);
          }}>
          {({ setFieldValue, values }) => (
            <Form>
              <div className="MCP-panel-container">
                <Field
                  name="file"
                  validateOnChange={validateFile}
                  label={t('button.caption.uploadFile')}
                  component={Components['inputFile']}
                  attachmentValue={values.file}
                  setFieldValue={setFieldValue}
                />
              </div>
              <div className="controls uploadControls">
                <Button variant="secondary" type="button" onClick={() => navigate(-1)} size={'md'}>
                  {t('Cancel')}
                </Button>
                <Button type="submit" size={'md'}>
                  {`Add ${label}`}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </React.Fragment>
  );
}

export default UploadUsersFile;
