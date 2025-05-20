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
  customDownload,
  downloadTemplate,
  upload,
  cancel,
  onFileSelection,
  prefixChildren = false,
  suffixChildren = false,
  uploadLabel = null,
  isRequired = false,
  infoHeader,
  children
}) {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const cancelFunction = cancel.fn ? cancel.fn : () => navigate(-1);

  if (isLoading) return <Loader type="screen" />;

  return (
    <React.Fragment>
      <div className="MCP-module-body">
        <div>
          <ModuleHeader
            heading={<Heading as="h1">{primaryHeading}</Heading>}
            controls={
              <React.Fragment>
                {customDownload}
                {downloadTemplate && (
                  <div className="controls">
                    <Button
                      className="button-icon"
                      variant="secondary"
                      size="md"
                      onClick={downloadTemplate.fn}>
                      {downloadTemplate.caption}
                    </Button>
                  </div>
                )}
              </React.Fragment>
            }
          />
          {infoHeader && <span className="info-upload">{infoHeader}</span>}
        </div>
        {messages.map((message) => {
          if (!message) return;
          return (
            <Alert
              description={message.description}
              onClose={() => {
                onCloseAlert && onCloseAlert(message.id);
              }}
              isSticky={message.isSticky || message.type === 'error'}
              type={message.type}
            />
          );
        })}
        <Formik
          initialValues={{ file: null }}
          onSubmit={(values, { setFieldValue }) => {
            upload.fn(values, setFieldValue);
            setFieldValue('file', null);
            fileInputRef.current.value = '';
          }}>
          {({ setFieldValue, values, resetForm }) => (
            <Form>
              <div className="MCP-panel-container">
                {controlHeading && <Heading as="h3">{controlHeading}</Heading>}

                {prefixChildren && !suffixChildren && children}

                <Field
                  name="file"
                  validateOnChange={onFileSelection}
                  label={t(uploadLabel || 'labels.upload.csv')}
                  component={Components['inputFile']}
                  attachmentValue={values.file}
                  setFieldValue={setFieldValue}
                  isRequired={isRequired}
                  primaryButtonCaption={t('button.upload.browse')}
                  fileInputRef={fileInputRef}
                />

                {!prefixChildren && suffixChildren && children}
              </div>
              <div className="controls uploadControls">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={cancelFunction}
                  size={'md'}>
                  {t(cancel.caption || 'Cancel')}
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
