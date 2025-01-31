import React from 'react';
import { LANGUAGE, QUESTION_TYPE } from './AddQuestionnaire';
import { Field, Form, Formik } from 'formik';
import Components from '@src/components/form/Components';
import CheckBox from '@src/components/form/CheckBox';
import FileInput from '@src/components/FileInput';

function QuestionnaireTemplate({ config, isPreview }) {
  const activeLanguage = 'en';
  console.log(config);
  if (!config && config.questions) {
    return (
      <div>
        <p>No question available</p>
      </div>
    );
  }

  const getControl = (controlConfig) => {
    const { text, type, checks, additionalAttributes, isDocumentRequired, isMandatory } = controlConfig;
    const questionLabel = text[activeLanguage];
    const fieldName = questionLabel.replace(' ', '_');
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
          value: option[LANGUAGE.ENGLISH].replace(' ', '_')
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
            <div className="fileUploadControl">
              <Field name={`${fieldName}.attachment`}>
                {({ field, form }) => (
                  <FileInput
                    initialLogo={field.value}
                    onFileSelect={(file) => {
                      form.setFieldValue(field.name, file);
                    }}
                    label="Upload file"
                  />
                )}
              </Field>
            </div>
          )}
        </div>
      </div>
    );

    return field;
  };

  return (
    <Formik>
      <Form>
        <div className="MCP-CardContainer">{config.questions.map((question) => getControl(question))}</div>;
      </Form>
    </Formik>
  );
}

export default QuestionnaireTemplate;
