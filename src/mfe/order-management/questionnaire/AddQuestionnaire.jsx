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

const LANGUAGE = {
  ENGLISH: 'en',
  SPANISH: 'es'
};

function AddQuestionnaire() {
  const { t } = useTranslate();
  const [mode, setMode] = React.useState(MODE.CREATE);
  const navigate = useNavigate();
  const { id } = useParams();
  const [lang, setLang] = React.useState('en');
  const schema = Yup.object().shape({
    templateName: Yup.string()
      .required(t('message.questionnaire.templateNameRequired'))
      .min(2, t('message.questionnaire.templateNameMinWidth'))
      .max(24, t('message.questionnaire.templateNameMaxWidth')),
    questionList: Yup.array().of(
      Yup.object().shape({
        questionType: Yup.string().required(t('message.questionnaire.selectTemplateType')),
        questionText: Yup.object()
          .required()
          .shape({
            en: Yup.string().required(t('message.questionnaire.provideQuestionText')),
            es: Yup.string(),
            activeLanguage: Yup.string().default(LANGUAGE.ENGLISH)
          }),
        questionOptions: Yup.array()
          .of(
            Yup.object().shape({
              en: Yup.string().required(t('Value is required')),
              es: Yup.string(),
              activeLanguage: Yup.string().default(LANGUAGE.ENGLISH)
            })
          )
          .nullable()
          .when('questionType', {
            is: (type) => type === QUESTION_TYPE.DROPDOWN || type === QUESTION_TYPE.RADIO_BUTTON || type === QUESTION_TYPE.CHECKBOX,
            then: (schema) =>
              schema.required('message.questionnaire.optionsRequired').default([
                { en: 'Option 1', es: '', activeLanguage: 'en' },
                { en: 'Option 2', es: '', activeLanguage: 'en' }
              ]),
            otherwise: (schema) => schema.notRequired()
          })
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

  const handleOnSubmit = (values) => {
    const { templateName, questionList } = values;
    const payload = {};
    payload.templateName = templateName;
    if (questionList && Array.isArray(questionList)) {
      payload.questions = questionList.map((question) => {
        const { checks, questionOptions, questionText, questionType } = question;
        const formattedQuestion = {
          type: questionType,
          text: {
            en: questionText.en,
            es: questionText.es
          }
        };
        if (checks)
          checks.forEach((check) => {
            formattedQuestion[check] = true;
          });

        if (questionOptions)
          formattedQuestion.additionalAttributes = {
            options: questionOptions.map(({ en, es }) => ({ en, es }))
          };

        return formattedQuestion;
      });
    }

    console.log(payload);
  };

  return (
    <div>
      <div>
        <Formik
          initialValues={{
            ['templateName']: '',
            ['questionList']: [
              {
                questionText: { en: '', es: '', activeLanguage: LANGUAGE.ENGLISH },
                questionType: ''
              }
            ]
          }}
          onSubmit={handleOnSubmit}
          enableReinitialize
          validationSchema={schema}>
          {({ values, errors, setFieldValue, setFieldError }) => (
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
                            name={`templateName`}
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
                      <FieldArray name="questionList">
                        {({ push: addQuestion, remove: removeQuestion }) => {
                          return (
                            <div>
                              <div>
                                {values['questionList'].map((question, index) => (
                                  <div key={index} className="template-question">
                                    <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                                      <div className="styled-form-field">
                                        <Field
                                          component={Components['dropdown']}
                                          name={`questionList.${index}.questionType`}
                                          fieldlabel={t('label.type')}
                                          placeholder=" "
                                          isRequired
                                          size="lg"
                                          onChange={(selectedType) => {
                                            setFieldValue(`questionList[${index}].questionType`, selectedType);
                                            if (selectedType === QUESTION_TYPE.INPUT) {
                                              setFieldValue(`questionList[${index}].questionOptions`, null);
                                            } else {
                                              setFieldValue(`questionList[${index}].questionOptions`, [
                                                { en: '', es: '', activeLanguage: 'en' },
                                                { en: '', es: '', activeLanguage: 'en' }
                                              ]);
                                            }
                                          }}
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
                                            disabled={values['questionList'].length === 1}
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
                                          name={`questionList.${index}.questionText['${question.questionText.activeLanguage}']`}
                                          fieldlabel={t('label.question')}
                                          labelControls={
                                            <Field
                                              name={`questionList.${index}.questionText.activeLanguage`}
                                              options={['en', 'es']}
                                              size="small"
                                              value={question['questionText']['activeLanguage']}
                                              component={Components['toggleButton']}
                                            />
                                            // <ToggleButton  onChange={handleOnLanguageChange} />
                                          }
                                          placeholder={` `}
                                          component={Components['textarea']}
                                          maxCharHelperText={t('message.questionTextMaxChar')}
                                          maxCharLimit={1000}
                                        />
                                      </div>
                                    </div>
                                    {question['questionType'] && question.questionOptions && (
                                      <div>
                                        <div className="template-form">
                                          {
                                            <FieldArray name={`questionList.${index}.questionOptions`}>
                                              {({ push: addOption, remove: removeOption }) => {
                                                return (
                                                  <div className="options">
                                                    <div className="option-list">
                                                      {question['questionOptions']?.map((option, optionIndex) => {
                                                        return (
                                                          <div>
                                                            <div className="grid grid-gap-24 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                                                              <div className="styled-form-field">
                                                                <Field
                                                                  name={`questionList.${index}.questionOptions.${optionIndex}.${option.activeLanguage}`}
                                                                  label={t('placeholder.optionItr') + (optionIndex + 1)}
                                                                  placeholder={t('placeholder.optionItr')}
                                                                  component={Components['input']}
                                                                  isRequired
                                                                  labelControls={
                                                                    <Field
                                                                      name={`questionList.${index}.questionOptions.${optionIndex}.activeLanguage`}
                                                                      options={['en', 'es']}
                                                                      size="small"
                                                                      value={option['activeLanguage']}
                                                                      component={Components['toggleButton']}
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
                                                                    disabled={question['questionOptions'].length === 2}
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
                                          }
                                        </div>
                                      </div>
                                    )}
                                    <div className="stacked-checkbox">
                                      <Field
                                        name={`questionList.${index}.checks`}
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
                                      addQuestion({ ['questionType']: '', questionText: '', questionOptions: [] });
                                    }}
                                    variant="tertiary"
                                    size="md"
                                    Icon={PlusIcon}>
                                    {t('button.caption.addQuestion')}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        }}
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
