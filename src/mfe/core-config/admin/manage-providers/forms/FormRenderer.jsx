import React from 'react';
import { Field, useFormikContext } from 'formik';
import Components from '@src/components/form/Components';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading, Button } from '@mckesson/mcp-component-library';
import CommonUtils from '@src/util/CommonUtils';
import { getNestedValue } from '@src/components/form/util';
import { validateFile } from '@src/components/uploadFile/uploadUtils';
import CheckBox from '@src/components/form/formik/CheckBoxFormik';

function getFileNameAndType(url) {
  if (url instanceof File) {
    return {
      name: url.name,
      type: url.type,
      size: url.size,
      lastModified: url.lastModified
    };
  }

  const cleanUrl = url?.split('?')[0].split('#')[0] || '';
  const name = cleanUrl.split('/').pop() || '';
  const type = name.includes('.') ? name.split('.').pop() : '';

  return {
    name,
    type
  };
}
const ALLOWED_FILE_TYPE = ['application/pdf', 'image/png', 'image/jpeg'];

const FormRenderer = ({ onClose, onUpload, closeIcon, fieldPrefix = '', sections = [], insurance, insuranceLevel, readOnly }) => {
  const { t } = useTranslate();
  const { values, setFieldValue } = useFormikContext();

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <div className="MCP-form">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="form-section">
              {(section.title || section.primaryAction || section.isRequired) && (
                <div className={'row-space-between-center'}>
                  <div className="form-section-heading">{section.title && <Heading as="h1">{t(section.title)}</Heading>}</div>
                  <div className="controls">
                    {section.primaryAction}
                    {section.isRequired && (
                      <p className="form-instruction">
                        <span className="required">*</span> {t('labels.required')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {(section.subTitle || section.secondaryActions) && (
                <div className={'row-space-between-center'}>
                  <div className="form-section-heading">{section.subTitle && <Heading as="h3">{t(section.subTitle)}</Heading>}</div>
                  <div className="controls">
                    {onClose && sectionIndex === 0 && (
                      <div className="styled-icon-button error-button">
                        <Button Icon={closeIcon} size="md" variant="tertiary" color="error" type="button" onClick={onClose}></Button>
                      </div>
                    )}
                    {section.secondaryActions}
                  </div>
                </div>
              )}

              {section.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="form-control-row">
                  <div key={rowIndex} className={`${row.grid}`}>
                    {row.controls.map((control, controlIndex) => {
                      let Component;
                      if (control.type === 'checkbox') {
                        Component = CheckBox;
                      } else {
                        Component = Components[control.type];
                      }
                      if (!Component) return null;

                      if (control.when && Array.isArray(control.when) && control.when.length === 2) {
                        const [key, fn] = control.when;
                        if (typeof key === 'string' && typeof fn === 'function') {
                          const refValue = getNestedValue(values, key);
                          if (!fn(refValue)) return null;
                        }
                      }

                      const uploadControlAttributes = {};
                      if (control.type === 'inputFile') {
                        const attachmentValue = getNestedValue(values, control.name);
                        if (attachmentValue) {
                          if (typeof attachmentValue === 'string') {
                            uploadControlAttributes.attachmentValue = getFileNameAndType(attachmentValue);
                          } else if (typeof attachmentValue === 'object' && CommonUtils.isNonEmptyObject(attachmentValue)) {
                            uploadControlAttributes.attachmentValue = attachmentValue;
                          }
                        }

                        uploadControlAttributes.validateOnChange = (file) => validateFile(t, file, ALLOWED_FILE_TYPE);
                        uploadControlAttributes.onFileChange = (file) => onUpload(file, setFieldValue, control.name);
                        uploadControlAttributes.fileTypeText = 'PDF, PNG, JPEG, JPG';
                      }

                      // Prepare all props for Field
                      const fieldProps = {
                        ...control,
                        ...uploadControlAttributes,
                        id: `${fieldPrefix}${control.name}`,
                        key: CommonUtils.generateUniqueCode(fieldPrefix + control.name + controlIndex),
                        name: `${fieldPrefix}${control.name}`,
                        label: t(control.label),
                        placeholder: control.placeholder || ' ',
                        isRequired: control.isRequired,
                        component: Component,
                        options: control.options,
                        maxLength: control.maxLength,
                        isReadOnly: control.isReadOnly,
                        fieldlabel: control.fieldLabel
                      };

                      return <Field {...fieldProps} />;
                    })}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormRenderer;
