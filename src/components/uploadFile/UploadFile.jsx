import React, { useRef, useState } from 'react';
import {
  Button,
  Heading,
  Alert,
  Loader
} from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import Components from '@src/components/form/Components';

function UploadFile({
  primaryHeading,
  controlHeading,
  isLoading,
  messages,
  onCloseAlert,
  downloadTemplate,
  upload,
  onFileSelection,
  prefixChildren = false,
  children
}) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  if (isLoading) return <Loader type="screen" />;

  return (
    <React.Fragment>
      <div className="MCP-module-wrapper">
        <ModuleHeader
          heading={<Heading as="h1">{primaryHeading}</Heading>}
          controls={
            downloadTemplate && (
              <div className="controls">
                <Button
                  className="button-icon"
                  variant="secondary"
                  size="md"
                  onClick={downloadTemplate.fn}>
                  {downloadTemplate.caption}
                </Button>
              </div>
            )
          }
        />

        {messages.map((message) => {
          if (!message) return;
          return (
            <Alert
              description={message.description}
              onClose={() => {
                onCloseAlert && onCloseAlert(message.id);
              }}
              type={message.type}
            />
          );
        })}
        <Formik
          initialValues={{ file: null }}
          onSubmit={(values, { setFieldValue }) => {
            upload.fn(values);
            setFieldValue('file', null);
            fileInputRef.current.value = '';
          }}>
          {({ setFieldValue, values, resetForm }) => (
            <Form>
              <div className="MCP-panel-container">
                {controlHeading && <Heading as="h3">{controlHeading}</Heading>}

                {prefixChildren && children}

                <Field
                  name="file"
                  validateOnChange={onFileSelection}
                  label={t('labels.upload.csv')}
                  component={Components['inputFile']}
                  attachmentValue={values.file}
                  setFieldValue={setFieldValue}
                  primaryButtonCaption={t('button.upload.browse')}
                  fileInputRef={fileInputRef}
                />

                {!prefixChildren && children}
              </div>
              <div className="controls uploadControls">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate(-1)}
                  size={'md'}>
                  {t('Cancel')}
                </Button>
                <Button type="submit" size={'md'}>
                  {upload.caption}
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
