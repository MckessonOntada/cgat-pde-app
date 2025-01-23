import React from 'react';
import { Button, Heading, CheckboxGroup, TextareaInput, InputField } from '@mckesson/mcp-component-library';
import { ReactComponent as ArrowLeftIcon } from '@src/assets/svg/arrow-left.svg';
import { Field, Formik, Form, FieldArray } from 'formik';
import Components from '@src/components/form/Components';
import { ReactComponent as PlusIcon } from '@src/assets/svg/plus.svg';
import { ReactComponent as BinRedIcon } from '@src/assets/svg/bin-red.svg';
import useQuestionnaire from './useQuestionnaire';
import * as Yup from 'yup';
import CheckBox from '@src/components/form/CheckBox';

const QUESTION_TYPE = {
  RADIO_BUTTON: 'radio_button',
  DROPDOWN: 'dropdown',
  CHECKBOX: 'checkbox',
  INPUT: 'input'
};

const schema = Yup.object().shape({
  ['template-name']: Yup.string()
    .required('Template name is required')
    .min(2, 'Template name must be at least 2 characters')
    .max(24, 'Template name must be at most 24 characters'),
  ['question-list']: Yup.array().of(
    Yup.object().shape({
      ['question-type']: Yup.string().required('You must select a template type'),
      ['question-text']: Yup.string().required('You must select a template type'),
      ['question-option']: Yup.array().of(
        Yup.object().shape({
          value: Yup.string().required('Option value is required')
        })
      )
    })
  )
});

function AddQuestionnaire() {
  return (
    <div>
      <div>
        <Formik
          initialValues={{
            ['template-name']: '',
            ['question-list']: [
              {
                'question-text': '',
                'question-type': '',
                'question-option': [{ value: '' }, { value: '' }],
                checks: []
              }
            ]
          }}
          onSubmit={console.log}
          enableReinitialize
          validationSchema={schema}>
          {({ values, errors }) => (
            <Form>
              <div className="MCP-module-wrapper">
                <div className="MCP-module-header">
                  <div className="styled-icon-button">
                    <Button variant="tertiary" size="md" Icon={ArrowLeftIcon}>
                      Back to Questionnaire Builder
                    </Button>
                  </div>
                </div>
                <div className="MCP-module-body">
                  <div className="styled-heading">
                    <Heading as="h1">Add Questionnaire</Heading>
                  </div>

                  <div className="MCP-CardContainer">
                    <div className="template">
                      <div className="styledHeading">
                        <Heading as="h2">Template Details</Heading>
                      </div>
                      <div class="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                        <div className="styled-form-field">
                          <Field
                            name={`template-name`}
                            label={`Template Name`}
                            placeholder={` `}
                            errors={{ name: 'error' }}
                            isRequired
                            component={Components['input']}
                          />
                        </div>
                      </div>
                      <div className="styledHeading">
                        <Heading as="h2">Questions</Heading>
                      </div>
                      <FieldArray name="question-list">
                        {({ push: addQuestion, remove: removeQuestion }) => (
                          <div>
                            <div>
                              {values['question-list'].map((question, index) => (
                                <div key={index} className="template-question">
                                  <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                                    <div className="styled-form-field">
                                      <Field
                                        component={Components['dropdown']}
                                        name={`question-list.${index}.question-type`}
                                        fieldlabel={'Type'}
                                        placeholder=" "
                                        isRequired
                                        size="lg"
                                        options={[
                                          { label: 'Input Field', value: 'input' },
                                          { label: 'Radio Button', value: 'radio_button' },
                                          { label: 'Checkbox', value: 'checkbox' },
                                          { label: 'Dropdown', value: 'dropdown' }
                                        ]}
                                      />
                                    </div>
                                    <div className="void-gap"></div>
                                    <div className="flex-end">
                                      <div className="styled-icon-button error-button">
                                        <Button
                                          Icon={BinRedIcon}
                                          size="md"
                                          variant="tertiary"
                                          color="error"
                                          type="button"
                                          disabled={values['question-list'].length === 1}
                                          onClick={() => {
                                            removeQuestion(index);
                                          }}>
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="styled-form-field">
                                    <Field
                                      name={`question-list.${index}.question-text`}
                                      fieldlabel={'Question'}
                                      placeholder={` `}
                                      component={Components['textarea']}
                                      maxCharHelperText="Maximum 1,000 Characters"
                                      maxCharLimit={1000}
                                      maxCharWarningLimit={900}
                                      maxLimitReachedHelpertext="Character limit reached"
                                    />
                                  </div>
                                  {question['question-type'] && (
                                    <div>
                                      <div className="template-form">
                                        {(question['question-type'] === QUESTION_TYPE.RADIO_BUTTON ||
                                          question['question-type'] === QUESTION_TYPE.DROPDOWN) && (
                                          <FieldArray name={`question-list.${index}.question-option`}>
                                            {({ push: addOption, remove: removeOption }) => {
                                              return (
                                                <div className="options">
                                                  <div className="option-list">
                                                    {question['question-option']?.map((option, optionIndex) => {
                                                      return (
                                                        <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                                                          <div className="styled-form-field">
                                                            <Field
                                                              name={`question-list.${index}.question-option.${optionIndex}.value`}
                                                              label={`Option ${optionIndex + 1}`}
                                                              placeholder={`Option ${optionIndex + 1}`}
                                                              component={Components['input']}
                                                              isRequired
                                                              fieldlabel={'Question'}
                                                            />
                                                          </div>
                                                          <div className="void-gap"></div>
                                                          <div className="flex-end">
                                                            <div className="styled-icon-button error-button">
                                                              <Button
                                                                Icon={BinRedIcon}
                                                                size="md"
                                                                variant="tertiary"
                                                                color="error"
                                                                type="button"
                                                                disabled={question['question-option'].length === 2}
                                                                onClick={() => {
                                                                  removeOption(optionIndex);
                                                                }}>
                                                                Delete
                                                              </Button>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                  <div>
                                                    <div className="styled-icon-button">
                                                      <Button
                                                        Icon={PlusIcon}
                                                        size="md"
                                                        variant="tertiary"
                                                        type="button"
                                                        onClick={() => {
                                                          addOption({
                                                            value: ''
                                                          });
                                                        }}>
                                                        Add Option
                                                      </Button>
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            }}
                                          </FieldArray>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  <div className="stacked-checkbox">
                                    <Field
                                      name={`question-list.${index}.checks`}
                                      items={[
                                        {
                                          label: 'Mark this question as mandatory',
                                          value: 'isMandatory'
                                        },
                                        {
                                          label: 'Document upload required?',
                                          value: 'isDocumentRequired'
                                        }
                                      ]}
                                      size="md"
                                      component={CheckBox}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div>
                              <div className="styled-icon-button">
                                <Button
                                  onClick={() => {
                                    addQuestion({ ['question-type']: '', 'question-text': '', options: [] });
                                  }}
                                  variant="tertiary"
                                  size="md"
                                  Icon={PlusIcon}>
                                  Add Question
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                  <div className="controls">
                    <Button size="md" variant="secondary">
                      Cancel
                    </Button>
                    <Button type="submit" size="md" variant="primary">
                      Create Questionnaire
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AddQuestionnaire;
