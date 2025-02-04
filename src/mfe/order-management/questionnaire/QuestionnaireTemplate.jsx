import React from 'react';
import { LANGUAGE, QUESTION_TYPE } from './AddQuestionnaire';
import styles from './QuestionnaireTemplate.module.scss';
import { Field } from 'formik';
import Components from '@src/components/form/Components';
import CheckBox from '@src/components/form/CheckBox';
import { Button } from '@mckesson/mcp-component-library';
import FileInput from '@src/components/FileInput';
import { Link } from 'react-router-dom';
import { ReactComponent as BinRedIcon } from '@src/assets/svg/bin-red.svg';
import { ReactComponent as FileUploadIcon } from '@src/assets/svg/document.svg';

function QuestionnaireTemplate({ onFileUpload, config, isPreview, onRemoveFile }) {
  const activeLanguage = 'en';

  if (
    !config ||
    (typeof config === 'object' && !Array.isArray(config) && !config.hasOwnProperty('questions')) ||
    (typeof config !== 'object' && !Array.isArray(config))
  ) {
    return <div>No preview</div>;
  }

  const getControl = (controlConfig, id, differentiator) => {
    const { text, type, additionalAttributes, isDocumentRequired, isMandatory, documentUrl } = controlConfig;

    const questionLabel = text[LANGUAGE.ENGLISH]?.trim();
    const fieldName = `${id}#${questionLabel.replace(/ /g, '_')}`;
    const attributes = {};
    if (isMandatory) {
      attributes.isRequired = true;
    }

    let wrapperClass = ['styled-form-field'];
    const _components = {
      [QUESTION_TYPE.INPUT]: Components['input'],
      [QUESTION_TYPE.RADIO_BUTTON]: Components['radioGroup'],
      [QUESTION_TYPE.DROPDOWN]: Components['dropdown'],
      [QUESTION_TYPE.CHECKBOX]: CheckBox
    };

    attributes.component = _components[type.toUpperCase()];

    if (type !== QUESTION_TYPE.INPUT) {
      const options =
        additionalAttributes?.options.map((option) => ({
          isDisabled: false,
          label: option[activeLanguage] || option[LANGUAGE.ENGLISH],
          value: option[LANGUAGE.ENGLISH].replace(/ /g, '_')
        })) || [];

      if (type === QUESTION_TYPE.DROPDOWN) attributes.options = options;
      else attributes.items = options;
    }

    if (type === QUESTION_TYPE.RADIO_BUTTON) {
      attributes.caption = questionLabel;
      attributes.id = `radio-button-${id}-${differentiator}`;
      attributes.itemCustomStyles = { fontSize: '14px', marginRight: '24px', fontWeight: '400' };
      attributes.labelCustomStyles = { marginBottom: '8px', fontSize: '14px' };
    }

    if (type === QUESTION_TYPE.CHECKBOX) {
      attributes.caption = questionLabel;
      wrapperClass.push('stacked-checkbox');
      attributes.id = `checkbox-${id}-${differentiator}`;
      attributes.itemCustomStyles = { fontSize: '14px', marginRight: '24px', fontWeight: '400' };
      attributes.labelCustomStyles = { marginBottom: '8px', fontSize: '14px' };
    }
    const field = (
      <div className={wrapperClass.join(' ')}>
        {/* <div className="field-caption">{questionLabel}</div> */}
        <div className="styled-control-wrapper">
          <div class="grid grid-gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            <Field name={fieldName} label={questionLabel} placeholder={` `} {...attributes} />
          </div>
          {isDocumentRequired && (
            <div>
              {documentUrl ? (
                <div className={styles['attachment-ribbon']}>
                  <div class="grid grid-gap-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    <div className="row-space-between-center">
                      <div className={styles['filename']}>
                        <FileUploadIcon width={20} />
                        <Link to={documentUrl}>{documentUrl.substring(documentUrl.lastIndexOf('/') + 1)}</Link>
                      </div>
                      <div className="styled-icon-button error-button">
                        <Button
                          Icon={BinRedIcon}
                          size="md"
                          variant="tertiary"
                          color="error"
                          type="button"
                          onClick={() => onRemoveFile(fieldName)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`fileUploadControl ${isPreview ? 'readonly' : ''}`}>
                  <Field name={`${fieldName}.attachment`}>
                    {({ field, form }) => (
                      <FileInput
                        initialLogo={field.value}
                        onFileSelect={(file) => {
                          onFileUpload(`${fieldName}#attachment`, file);
                          form.setFieldValue(`${fieldName}#attachment`, file);
                        }}
                        label="Upload file"
                        buttonCaption={'Select File'}
                      />
                    )}
                  </Field>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );

    return field;
  };

  let templateList = [];
  if (typeof config === 'object' && !Array.isArray(config)) {
    templateList.push(
      <div className="template">{config.questions.map((question, questionIndex) => getControl(question, 1, questionIndex))}</div>
    );
  } else if (Array.isArray(config)) {
    {
      config.map((template, templateIndex) => {
        templateList.push(
          <div className="template">
            {template.questions.map((question, questionIndex) => getControl(question, template.id, questionIndex))}
          </div>
        );
      });
    }
  }
  console.log('templateList', templateList);
  return <div className="questionnaire-template-question-list">{templateList}</div>;
}

export default QuestionnaireTemplate;
