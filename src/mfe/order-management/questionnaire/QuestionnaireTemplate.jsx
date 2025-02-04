import React from 'react';
import { LANGUAGE, QUESTION_TYPE } from './AddQuestionnaire';
import { Field, Form, Formik } from 'formik';
import Components from '@src/components/form/Components';
import CheckBox from '@src/components/form/CheckBox';
import FileInput from '@src/components/FileInput';

function QuestionnaireTemplate({ onFileUpload, config, isPreview }) {
  const activeLanguage = 'en';

  if (
    !config ||
    (typeof config === 'object' && !Array.isArray(config) && !config.hasOwnProperty('questions')) ||
    (typeof config !== 'object' && !Array.isArray(config))
  ) {
    return <div>No preview</div>;
  }

  const getControl = (controlConfig, id) => {
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
    }

    if (type === QUESTION_TYPE.CHECKBOX) {
      attributes.caption = questionLabel;
      wrapperClass.push('stacked-checkbox');
    }

    const field = (
      <div className={wrapperClass.join(' ')}>
        {/* <div className="field-caption">{questionLabel}</div> */}
        <div className="styled-control-wrapper">
          <div class="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            <Field name={fieldName} label={questionLabel} placeholder={` `} {...attributes} />
          </div>
          {isDocumentRequired && (
            <div>
              {documentUrl ? (
                <div className="row-space-between-center">
                  <div>[link]</div> <button>Delete</button>
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
    templateList.push(<div className="template">{config.questions.map((question) => getControl(question, 1))}</div>);
  } else if (Array.isArray(config)) {
    {
      config.map((template) => {
        templateList.push(<div className="template">{template.questions.map((question) => getControl(question, template.id))}</div>);
      });
    }
  }
  console.log('templateList', templateList);
  return <div className="questionnaire-template-question-list">{templateList}</div>;
}

export default QuestionnaireTemplate;
