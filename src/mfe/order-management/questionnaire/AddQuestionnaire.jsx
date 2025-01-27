import React from 'react';
import { Button, Heading, Switch } from '@mckesson/mcp-component-library';
import { ReactComponent as ArrowLeftIcon } from '@src/assets/svg/arrow-left.svg';
import { Field, Formik, Form, FieldArray } from 'formik';
import Components from '@src/components/form/Components';
import { ReactComponent as PlusIcon } from '@src/assets/svg/plus.svg';
import { ReactComponent as BinRedIcon } from '@src/assets/svg/bin-red.svg';
import * as Yup from 'yup';
import CheckBox from '@src/components/form/CheckBox';
import { useTranslate } from '@src/translations/useTranslation';
import ToggleButton from './ToggleButton';
import { useNavigate, useParams } from 'react-router-dom';

const QUESTION_TYPE = {
  RADIO_BUTTON: 'radio_button',
  DROPDOWN: 'dropdown',
  CHECKBOX: 'checkbox',
  INPUT: 'input'
};

const MODE = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW'
};

function AddQuestionnaire() {
  const { t } = useTranslate();
  const [mode, setMode] = React.useState(MODE.CREATE);
  const navigate = useNavigate();
  const { id } = useParams();
  const [lang, setLang] = React.useState('en');
  const schema = Yup.object().shape({
    ['template-name']: Yup.string()
      .required(t('message.questionnaire.templateNameRequired'))
      .min(2, t('message.questionnaire.templateNameMinWidth'))
      .max(24, t('message.questionnaire.templateNameMaxWidth')),
    ['question-list']: Yup.array().of(
      Yup.object().shape({
        ['question-type']: Yup.string().required(t('message.questionnaire.selectTemplateType')),
        ['question-text']: Yup.string().required(t('message.questionnaire.provideQuestionText')),
        ['question-option']: Yup.array().of(
          Yup.object().shape({
            value: Yup.string().required(t('message.questionnaire.optionValueRequired'))
          })
        )
      })
    )
  });

  React.useEffect(() => {
    if (id) {
      setMode(MODE.EDIT);
      // fetch questionnaire details by id
      // re-structure response
      // assign it initial state
    }
  }, []);

  const handleOnLanguageChange = () => {
    if (lang == 'en') setLang('es');
    else setLang('en');
  };

  return (
    <div>
      <div>
        <Formik
          initialValues={{
            ['template-name']: '',
            ['question-list']: [
              {
                'question-text': { en: '', es: '' },
                'question-type': '',
                //default english text as value
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
                    <Button
                      onClick={() => navigate('/orders/system-configuration/questionnaire')}
                      variant="tertiary"
                      size="md"
                      Icon={ArrowLeftIcon}>
                      {t('button.caption.backQuestionnaireBuilder')}
                    </Button>
                  </div>
                </div>
                <div className="MCP-module-body">
                  <div className="styled-heading">
                    <Heading as="h1">{t('heading.addQuestionnaire')}</Heading>
                  </div>

                  <div className="MCP-CardContainer">
                    <div className="template">
                      <div className="styledHeading">
                        <Heading as="h2">{t('heading.templateDetails')}</Heading>
                      </div>
                      <div class="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                        <div className="styled-form-field">
                          <Field
                            name={`template-name`}
                            label={t('label.templateName')}
                            placeholder={` `}
                            errors={{ name: 'error' }}
                            isRequired
                            component={Components['input']}
                          />
                        </div>
                      </div>
                      <div className="styledHeading">
                        <Heading as="h2">{t('heading.questions')}</Heading>
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
                                        fieldlabel={t('label.type')}
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
                                          {t('labels.orderActions.delete')}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <div className="styled-form-field">
                                      <Field
                                        name={`question-list.${index}.question-text.${lang}`}
                                        fieldlabel={t('label.question')}
                                        labelControls={
                                          <ToggleButton options={['en', 'es']} size="small" onChange={handleOnLanguageChange} />
                                        }
                                        placeholder={` `}
                                        component={Components['textarea']}
                                        maxCharHelperText={t('message.questionTextMaxChar')}
                                        maxCharLimit={1000}
                                      />
                                    </div>
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
                                                        <div>
                                                          <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                                                            <div className="styled-form-field">
                                                              <Field
                                                                name={`question-list.${index}.question-option.${optionIndex}.value`}
                                                                label={t('placeholder.optionItr')}
                                                                placeholder={t('placeholder.optionItr')}
                                                                component={Components['input']}
                                                                isRequired
                                                                fieldlabel={t('label.question')}
                                                                labelControls={
                                                                  <ToggleButton
                                                                    options={['en', 'es']}
                                                                    size="small"
                                                                    onChange={handleOnLanguageChange}
                                                                  />
                                                                }
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
                                                                  {t('labels.orderActions.delete')}
                                                                </Button>
                                                              </div>
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
                                                        {t('button.addOption')}
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
                                          label: t('label.check.questionMandatory'),
                                          value: 'isMandatory'
                                        },
                                        {
                                          label: t('label.check.requiredDocument'),
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
                                  {t('button.caption.addQuestion')}
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
                      {t('captions.btnCancel')}
                    </Button>
                    {mode === MODE.EDIT ? (
                      <Button type="submit" size="md" variant="primary">
                        {t('button.caption.updateQuestionnaire')}
                      </Button>
                    ) : (
                      <Button type="submit" size="md" variant="primary">
                        {t('button.caption.createQuestionnaire')}
                      </Button>
                    )}
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
