import React from 'react';
import { LANGUAGE, QUESTION_TYPE } from './AddQuestionnaire';
import { Field, useFormikContext } from 'formik';
import Components from '@src/components/form/Components';
import CheckBox from '@src/components/form/CheckBox';
import CommonUtils from '@src/util/CommonUtils';
import { useTranslate } from '@src/translations/useTranslation';

function validateFile(file) {
  const maxSize = 5 * 1024 * 1024;
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv'
  ];

  const forbiddenMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/x-msdownload',
    'application/octet-stream',
    'application/x-sh'
  ];

  if (!file) {
    return { isValid: false, message: 'No file selected.' };
  }

  if (file.size > maxSize) {
    return { isValid: false, message: 'File size must be 5MB or smaller.' };
  }

  if (forbiddenMimeTypes.includes(file.type)) {
    return { isValid: false, message: 'Invalid file type. Images and executables are not allowed.' };
  }

  if (!allowedMimeTypes.includes(file.type)) {
    return { isValid: false, message: 'Unsupported file type. Please upload a valid document.' };
  }

  return { isValid: true, message: 'File is valid.' };
}

function QuestionnaireTemplate({ onDocumentChange, config, isPreview }) {
  const activeLanguage = LANGUAGE.ENGLISH;
  const { t } = useTranslate();
  const { values: formValues = {}, setFieldValue } = useFormikContext();

  if (
    !config ||
    (typeof config === 'object' && !Array.isArray(config) && !config.hasOwnProperty('questions')) ||
    (typeof config !== 'object' && !Array.isArray(config))
  ) {
    return <div>No preview</div>;
  }

  const getControl = (controlConfig, id, differentiator) => {
    const { text, type, additionalAttributes, isDocumentRequired, isMandatory } = controlConfig;
    const questionLabel = text[LANGUAGE.ENGLISH]?.trim();
    const fieldName = CommonUtils.generateUniqueCode(`${id}#${questionLabel}`);

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
        additionalAttributes?.options.map((option, index) => ({
          key: `questionnaire-${id}-language-option-${index}`,
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
      attributes.htmlFor = attributes.id;
      attributes.itemCustomStyles = { fontSize: '14px', marginRight: '24px', fontWeight: '400', display: 'inline' };
      attributes.labelCustomStyles = { marginBottom: '8px', fontSize: '14px' };
    }

    if (type === QUESTION_TYPE.CHECKBOX) {
      wrapperClass.push('stacked-checkbox');
      attributes.shouldSplitField = true;
      attributes.id = `checkbox-${id}-${differentiator}`;
      attributes.direction = 'row';
      attributes.itemCustomStyles = { fontSize: '14px', marginRight: '24px', fontWeight: '400' };
      attributes.labelCustomStyles = { marginBottom: '8px', fontSize: '14px' };
    }

    const { document: attachmentValue } = formValues[fieldName] || {};
    const field = (
      <div key={`questionnaire-control-section-${differentiator}`} className={wrapperClass.join(' ')}>
        <div className="styled-control-wrapper">
          <div
            className={`grid grid-gap-16 ${
              [QUESTION_TYPE.CHECKBOX, QUESTION_TYPE.RADIO_BUTTON].includes(type)
                ? 'grid-cols-1'
                : 'sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
            }`}>
            <Field name={`${fieldName}.value`} label={questionLabel} placeholder=" " {...attributes} />
          </div>

          {isDocumentRequired && (
            <div className={`fileUploadControl ${isPreview ? 'readonly' : ''}`}>
              <Field
                name={`${fieldName}.document`}
                validateOnChange={validateFile}
                onFileChange={(file) => onDocumentChange(fieldName, file, setFieldValue)}
                component={Components['inputFile']}
                attachmentValue={attachmentValue}
                setFieldValue={setFieldValue}
              />
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
      <div key={config.id} className="template">
        {config.questions.map((question, questionIndex) => getControl(question, 1, questionIndex))}
      </div>
    );
  } else if (Array.isArray(config)) {
    {
      config.map((template) => {
        templateList.push(
          <div key={template.id} className="template">
            {template.questions.map((question, questionIndex) => getControl(question, template.id, questionIndex))}
          </div>
        );
      });
    }
  }
  return <div className="questionnaire-template-question-list">{templateList}</div>;
}

export default QuestionnaireTemplate;
