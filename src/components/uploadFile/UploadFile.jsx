import React, { useRef, useState } from 'react';
import { Button, Heading, Alert, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import Components from '@src/components/form/Components';

function UploadFile({ label, subHeading, isLoading, alert, handleAlertClose, downloadTemplate, handleUpload, validateFile }) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  return (
    <React.Fragment>
      {isLoading && <Loader type="screen" />}
      <div className="MCP-module-wrapper">
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
            fileInputRef.current.value = '';
          }}>
          {({ setFieldValue, values, resetForm }) => (
            <Form>
              <div className="MCP-panel-container">
                {subHeading && <Heading as="h3">{subHeading}</Heading>}
                <Field
                  name="file"
                  validateOnChange={validateFile}
                  label={t('labels.upload.csv')}
                  component={Components['inputFile']}
                  attachmentValue={values.file}
                  setFieldValue={setFieldValue}
                  primaryButtonCaption={t('button.upload.browse')}
                  fileInputRef={fileInputRef}
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

export default UploadFile;
