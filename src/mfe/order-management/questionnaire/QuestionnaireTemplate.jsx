import React from 'react';
import { LANGUAGE, QUESTION_TYPE } from './AddQuestionnaire';
import { Field, Form, Formik } from 'formik';
import Components from '@src/components/form/Components';
import CheckBox from '@src/components/form/CheckBox';
import FileInput from '@src/components/FileInput';

const config = [
  {
    createdAt: null,
    updatedAt: '2025-01-30T14:17:28.240+00:00',
    id: 86,
    templateName: 'Basic info',
    questions: [
      {
        text: {
          en: 'What is your name? ',
          es: ''
        },
        type: 'INPUT',
        isMandatory: true,
        isDocumentRequired: true
      },
      {
        text: {
          en: 'What is your gender?',
          es: ''
        },
        type: 'RADIO_BUTTON',
        additionalAttributes: {
          options: [
            {
              en: 'Male',
              es: ''
            },
            {
              en: 'Female',
              es: ''
            }
          ]
        }
      },
      {
        text: {
          en: 'Select applicable options',
          es: ''
        },
        type: 'CHECKBOX',
        additionalAttributes: {
          options: [
            {
              en: 'Do you live in india?',
              es: ''
            },
            {
              en: 'Do you travel a lot?',
              es: ''
            },
            {
              en: 'Sample test question',
              es: ''
            }
          ]
        }
      },
      {
        text: {
          en: 'Select country you live in.',
          es: ''
        },
        type: 'DROPDOWN',
        additionalAttributes: {
          options: [
            {
              en: 'Delhi',
              es: ''
            },
            {
              en: 'Mumbai',
              es: ''
            },
            {
              en: 'Chennai',
              es: ''
            },
            {
              en: 'Culcatta',
              es: ''
            }
          ]
        }
      }
    ],
    configuredAt: ['Material', 'Account', 'Catalog'],
    active: true
  },
  {
    createdAt: '2025-01-31T07:34:58.340+00:00',
    updatedAt: '2025-01-31T10:55:33.497+00:00',
    id: 121,
    templateName: 'Slot Number Upd',
    questions: [
      {
        text: {
          en: 'Enter slot number you have.',
          es: ''
        },
        type: 'INPUT',
        isMandatory: true
      }
    ],
    configuredAt: ['Material', 'Account'],
    active: true
  }
];

function QuestionnaireTemplate({ isPreview }) {
  const activeLanguage = 'en';
  if (
    !config ||
    (typeof config === 'object' && !Array.isArray(config) && !config.hasOwnProperty('questions')) ||
    (typeof config !== 'object' && !Array.isArray(config))
  ) {
    return <div>No preview</div>;
  }

  const getControl = (controlConfig) => {
    const { text, type, additionalAttributes, isDocumentRequired, isMandatory } = controlConfig;
    const questionLabel = text[activeLanguage];
    const fieldName = questionLabel.replace(/ /g, '_');
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
            <div className="fileUploadControl">
              <Field name={`${fieldName}.attachment`}>
                {({ field, form }) => (
                  <FileInput
                    initialLogo={field.value}
                    onFileSelect={(file) => {
                      form.setFieldValue(field.name, file);
                    }}
                    label="Upload file"
                    buttonCaption={'Select File'}
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

  let templateList = [];
  if (typeof config === 'object' && !Array.isArray(config)) {
    templateList.push(<div className="template">{config.questions.map((question) => getControl(question))}</div>);
  } else if (Array.isArray(config)) {
    {
      config.map((template) => {
        templateList.push(<div className="template">{template.questions.map((question) => getControl(question))}</div>);
      });
    }
  }

  return (
    <Formik>
      <Form>
        <div className="questionnaire-template-question-list">{templateList}</div>;
      </Form>
    </Formik>
  );
}

export default QuestionnaireTemplate;
