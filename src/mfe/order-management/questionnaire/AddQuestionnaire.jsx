import React from 'react';
import { Button, Heading, Loader, Alert, Switch } from '@mckesson/mcp-component-library';
import { ReactComponent as ArrowLeftIcon } from '@src/assets/svg/arrow-left.svg';
import { Field, Formik, Form, FieldArray } from 'formik';
import { ReactComponent as EditPencil } from '@src/assets/image/edit_pencil.svg';
import Components from '@src/components/form/Components';
import { ReactComponent as PlusIcon } from '@src/assets/svg/plus.svg';
import { ReactComponent as BinRedIcon } from '@src/assets/svg/bin-red.svg';
import * as Yup from 'yup';
import CheckBox from '@src/components/form/CheckBox';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate, useParams } from 'react-router-dom';
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';
import { useMutation, useQuery } from 'react-query';
import QuestionnaireService from '@src/api/commonService/QuestionnaireService';
import QuestionnaireTemplate from './QuestionnaireTemplate';

export const QUESTION_TYPE = {
  RADIO_BUTTON: 'RADIO_BUTTON',
  DROPDOWN: 'DROPDOWN',
  CHECKBOX: 'CHECKBOX',
  INPUT: 'INPUT'
};

const MODE = {
  CREATE: 'CREATE',
  EDIT: 'EDIT',
  VIEW: 'VIEW'
};

export const LANGUAGE = {
  ENGLISH: 'en',
  SPANISH: 'es'
};

const INITIAL_FORM_STATE = {
  templateName: '',
  questions: [
    {
      caption: { en: '', es: '', activeLanguage: LANGUAGE.ENGLISH },
      type: ''
    }
  ]
};

const INITIAL_ALERT_CONFIG = {
  isVisible: false,
  description: '',
  type: null
};

function AddQuestionnaire() {
  const { t } = useTranslate();
  const [mode, setMode] = React.useState(MODE.CREATE);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [initialFormState, setInitialFormState] = React.useState(INITIAL_FORM_STATE);
  const [alertConfig, setAlertConfig] = React.useState(INITIAL_ALERT_CONFIG);
  const defaultQuestionTemplate = {
    type: '',
    caption: {
      en: '',
      es: '',
      activeLanguage: LANGUAGE.ENGLISH
    },
    options: []
  };
  React.useEffect(() => {
    if (id) {
      setMode(MODE.VIEW);
      getQuestionnaireDetails();
    }
  }, []);

  const {
    mutate: createQuestionnaire,
    isLoading,
    isError,
    data
  } = useMutation(async (payload) => QuestionnaireService.createQuestionnaire(payload), {
    onSuccess: (response) => {
      navigate('../', {
        state: {
          alertConfig: {
            isVisible: true,
            description: 'Questionnaire created successfully.',
            type: 'success'
          },
          refetch: true
        }
      });
    },
    onError: (error) => {}
  });

  const {
    mutate: updateQuestionnaire,
    isFetching: isUpdating,
    is: updateError,
    data: updateResponse
  } = useMutation(async ({ id, payload }) => QuestionnaireService.updateQuestionnaire(id, payload), {
    onSuccess: (response) => {
      navigate('../', {
        state: {
          alertConfig: {
            isVisible: true,
            description: 'Questionnaire updated successfully.',
            type: 'success'
          },
          refetch: true
        }
      });
    },
    onError: (error) => {}
  });

  const {
    mutate: deactivateQuestionnaire,
    isLoading: isDeactivating,
    isError: deactivateError,
    data: deactivateResponse
  } = useMutation(async (id) => QuestionnaireService.deactivateQuestionnaireById(id), {
    onSuccess: (response) => {
      setMode(MODE.VIEW);
      getQuestionnaireDetails();
      setAlertConfig({
        isVisible: true,
        description: 'Questionnaire deactivated successfully.',
        type: 'success'
      });
    },
    onError: (error) => {}
  });

  const {
    data: questionnaireDetails,
    isFetching: isFetchingQuestionnaireDetails,
    isError: isErrorOnFetching,
    error: fetchingError,
    refetch: getQuestionnaireDetails
  } = useQuery({
    queryKey: ['questionnaire-module', 'fetch-by-id', id],
    queryFn: async () => QuestionnaireService.getQuestionnaireById(id),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
    onSuccess: (result) => {
      if (result) {
        const { templateName, questions } = result;

        const formattedQuestions = questions.map((question) => {
          const { type, text, additionalAttributes, isDocumentRequired, isMandatory } = question;
          const _question = { type: type.toUpperCase(), checks: [] };
          if (isDocumentRequired) {
            _question.checks.push('isDocumentRequired');
          }
          if (isMandatory) {
            _question.checks.push('isMandatory');
          }

          _question.caption = { ...text, activeLanguage: LANGUAGE.ENGLISH };

          if (additionalAttributes?.options && Array.isArray(additionalAttributes.options)) {
            _question.options = additionalAttributes.options.map((option) => ({
              ...option,
              activeLanguage: LANGUAGE.ENGLISH
            }));
          }

          return _question;
        });

        const existingInitialState = {
          templateName,
          questions: formattedQuestions
        };

        setInitialFormState(existingInitialState);
      }
    },
    onError: (error) => {
      setAlertConfig({
        isVisible: true,
        description: error.message,
        type: 'error'
      });
    }
  });

  const schema = Yup.object().shape({
    templateName: Yup.string()
      .required(t('message.questionnaire.templateNameRequired'))
      .min(2, t('message.questionnaire.templateNameMinWidth'))
      .max(24, t('message.questionnaire.templateNameMaxWidth')),
    questions: Yup.array().of(
      Yup.object().shape({
        type: Yup.string().required(t('message.questionnaire.selectTemplateType')),
        caption: Yup.object()
          .required('question text is required')
          .shape({
            en: Yup.string(),
            es: Yup.string(),
            activeLanguage: Yup.string().default(LANGUAGE.ENGLISH)
          }),
        options: Yup.array()
          .of(
            Yup.object().shape({
              en: Yup.string(),
              es: Yup.string(),
              activeLanguage: Yup.string().default(LANGUAGE.ENGLISH)
            })
          )
          .nullable()
          .when('type', {
            is: (type) => type === QUESTION_TYPE.DROPDOWN || type === QUESTION_TYPE.RADIO_BUTTON || type === QUESTION_TYPE.CHECKBOX,
            then: (schema) =>
              schema.default([
                { en: '', es: '', activeLanguage: 'en' },
                { en: '', es: '', activeLanguage: 'en' }
              ]),
            otherwise: (schema) => schema.notRequired()
          })
      })
    )
  });

  const handleOnSubmit = (values, { setFieldError, setFieldValue }) => {
    const { templateName, questions } = values;

    let areQuestionValid = true;
    questions.forEach((question, questionIndex) => {
      if (question.type !== QUESTION_TYPE.INPUT) {
        const minimumOptionsIndex = {
          [QUESTION_TYPE.DROPDOWN]: 2,
          [QUESTION_TYPE.RADIO_BUTTON]: 2,
          [QUESTION_TYPE.CHECKBOX]: 1
        };
        if (!question.options || question.options.length < minimumOptionsIndex[question.type]) {
          alert('Options are enough');
          areQuestionValid = false;
        }

        question.options.forEach((option, optionIndex) => {
          if (!option.en) {
            areQuestionValid = false;
            setFieldValue(`questions.${questionIndex}.options.${optionIndex}.activeLanguage`, LANGUAGE.ENGLISH);
            setFieldError(`templateName`, 'at least requires english text');
            //questions.${questionIndex}.options.${optionIndex}
          }
        });
      }
    });

    if (!areQuestionValid) return;

    const payload = {};
    payload.templateName = templateName;
    if (questions && Array.isArray(questions)) {
      payload.questions = questions.map((question) => {
        const { checks, options, caption, type } = question;
        const formattedQuestion = {
          type: type,
          text: {
            en: caption.en,
            es: caption.es
          }
        };
        if (checks)
          checks.forEach((check) => {
            formattedQuestion[check] = true;
          });

        if (options)
          formattedQuestion.additionalAttributes = {
            options: options.map(({ en, es }) => ({ en, es }))
          };

        return formattedQuestion;
      });
    }

    if (mode === MODE.EDIT) {
      updateQuestionnaire({ id, payload });
    } else {
      createQuestionnaire(payload);
    }
  };

  const handleOnDeactivateQuestionnaire = () => {
    const state = {};
    state.title = t('labels.confirmationmessage');
    state.body = (
      <div className="MCP-modal-body">
        <p>{t('labels.template_deactivateConfirmation')}</p>
      </div>
    );
    state.footer = (
      <div className="controls">
        <Button size="md" variant="secondary" onClick={() => dispatch(closeModal())}>
          Cancel
        </Button>
        <Button
          size="md"
          variant="primary"
          onClick={() => {
            deactivateQuestionnaire(id);
            dispatch(closeModal());
          }}>
          Yes
        </Button>
      </div>
    );
    dispatch(openModal(state));
  };

  const readOnly = mode === MODE.VIEW;

  if (id && isFetchingQuestionnaireDetails) {
    return <Loader variant="circular" />;
  }

  return (
    <div>
      <div>
        <Formik disabled initialValues={initialFormState} onSubmit={handleOnSubmit} enableReinitialize validationSchema={schema}>
          {({ values, errors, setFieldValue, setFieldError }) => {
            return (
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

                    {alertConfig.isVisible && (
                      <Alert
                        description={alertConfig.description}
                        onClose={() => setAlertConfig(INITIAL_ALERT_CONFIG)}
                        type={alertConfig.type}
                        duration={10000}
                      />
                    )}

                    <div className="MCP-CardContainer">
                      <div className="template">
                        <div className="row-space-between-center">
                          <div className="styledHeading">
                            <Heading as="h2">{t('heading.templateDetails')}</Heading>
                          </div>
                          {mode !== MODE.CREATE && questionnaireDetails?.active && (
                            <div className="controls">
                              {mode !== MODE.EDIT && (
                                <Button Icon={EditPencil} variant="secondary" size="md" onClick={() => setMode(MODE.EDIT)}>
                                  {t('captions.btnEdit')}
                                </Button>
                              )}
                              <Switch
                                handleToggle={handleOnDeactivateQuestionnaire}
                                id="id"
                                name="Toggle"
                                size="lg"
                                value={questionnaireDetails?.active}
                              />
                            </div>
                          )}
                        </div>
                        <div class="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                          <div className="styled-form-field">
                            <Field
                              name={`templateName`}
                              label={t('label.templateName')}
                              placeholder={` `}
                              errors={{ name: 'error' }}
                              isRequired
                              isReadOnly={readOnly}
                              component={Components['input']}
                            />
                          </div>
                        </div>
                        <div className="styledHeading">
                          <Heading as="h2">{t('heading.questions')}</Heading>
                        </div>
                        <FieldArray name="questions">
                          {({ push: addQuestion, remove: removeQuestion }) => {
                            return (
                              <div>
                                <div>
                                  {values['questions']?.map((question, index) => (
                                    <div key={index} className="template-question">
                                      <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                                        <div className="styled-form-field">
                                          <Field
                                            component={Components['dropdown']}
                                            name={`questions.${index}.type`}
                                            fieldlabel={t('label.type')}
                                            placeholder=" "
                                            isRequired
                                            isReadOnly={readOnly}
                                            size="lg"
                                            onChange={(selectedType) => {
                                              setFieldValue(`questions[${index}].type`, selectedType);
                                              if (selectedType === QUESTION_TYPE.INPUT) {
                                                setFieldValue(`questions[${index}].options`, null);
                                              } else {
                                                setFieldValue(`questions[${index}].options`, [
                                                  { en: '', es: '', activeLanguage: 'en' },
                                                  { en: '', es: '', activeLanguage: 'en' }
                                                ]);
                                              }
                                            }}
                                            options={[
                                              { label: 'Input Field', value: QUESTION_TYPE.INPUT },
                                              { label: 'Radio Button', value: QUESTION_TYPE.RADIO_BUTTON },
                                              { label: 'Checkbox', value: QUESTION_TYPE.CHECKBOX },
                                              { label: 'Dropdown', value: QUESTION_TYPE.DROPDOWN }
                                            ]}
                                          />
                                        </div>
                                        <div className="void-gap"></div>
                                        {mode !== MODE.VIEW && (
                                          <div className="flex-end">
                                            <div className="styled-icon-button error-button">
                                              <Button
                                                Icon={BinRedIcon}
                                                size="md"
                                                variant="tertiary"
                                                color="error"
                                                type="button"
                                                disabled={values['questions'].length === 1}
                                                onClick={() => {
                                                  removeQuestion(index);
                                                }}>
                                                {t('labels.orderActions.delete')}
                                              </Button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      <div>
                                        <div className="styled-form-field">
                                          <Field
                                            name={`questions.${index}.caption['${question.caption.activeLanguage}']`}
                                            fieldlabel={t('label.question')}
                                            isReadOnly={readOnly}
                                            labelControls={
                                              <Field
                                                name={`questions.${index}.caption.activeLanguage`}
                                                options={['en', 'es']}
                                                size="small"
                                                value={question['caption']['activeLanguage']}
                                                component={Components['toggleButton']}
                                              />
                                            }
                                            placeholder={` `}
                                            component={Components['textarea']}
                                            maxCharHelperText={t('message.questionTextMaxChar')}
                                            maxCharLimit={1000}
                                          />
                                        </div>
                                      </div>
                                      {question['type'] && question.options && (
                                        <div className="template-form">
                                          {
                                            <FieldArray name={`questions.${index}.options`}>
                                              {({ push: addOption, remove: removeOption }) => {
                                                return (
                                                  <div className="options" key={`question-${index}`}>
                                                    <div className="option-list">
                                                      {question['options']?.map((option, optionIndex) => {
                                                        return (
                                                          <div key={`question-${index}-option-${optionIndex}`}>
                                                            <div className="grid grid-gap-24 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                                                              <div className="styled-form-field">
                                                                <Field
                                                                  name={`questions.${index}.options.${optionIndex}.${option.activeLanguage}`}
                                                                  label={t('placeholder.optionItr') + (optionIndex + 1)}
                                                                  placeholder={t('placeholder.optionItr')}
                                                                  component={Components['input']}
                                                                  isRequired
                                                                  isReadOnly={readOnly}
                                                                  labelControls={
                                                                    <Field
                                                                      name={`questions.${index}.options.${optionIndex}.activeLanguage`}
                                                                      options={['en', 'es']}
                                                                      size="small"
                                                                      value={option['activeLanguage']}
                                                                      component={Components['toggleButton']}
                                                                    />
                                                                  }
                                                                />
                                                              </div>
                                                              <div className="void-gap"></div>
                                                              {mode !== MODE.VIEW && (
                                                                <div className="flex-end">
                                                                  <div className="styled-icon-button error-button">
                                                                    <Button
                                                                      Icon={BinRedIcon}
                                                                      size="md"
                                                                      variant="tertiary"
                                                                      color="error"
                                                                      type="button"
                                                                      disabled={question['options'].length === 2 || readOnly}
                                                                      onClick={() => {
                                                                        removeOption(optionIndex);
                                                                      }}>
                                                                      {t('labels.orderActions.delete')}
                                                                    </Button>
                                                                  </div>
                                                                </div>
                                                              )}
                                                            </div>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                    <div>
                                                      {mode !== MODE.VIEW && (
                                                        <div className="styled-icon-button">
                                                          <Button
                                                            Icon={PlusIcon}
                                                            size="md"
                                                            variant="tertiary"
                                                            type="button"
                                                            disabled={readOnly}
                                                            onClick={() => {
                                                              addOption({
                                                                en: '',
                                                                es: '',
                                                                activeLanguage: LANGUAGE.ENGLISH
                                                              });
                                                            }}>
                                                            {t('button.addOption')}
                                                          </Button>
                                                        </div>
                                                      )}
                                                    </div>
                                                  </div>
                                                );
                                              }}
                                            </FieldArray>
                                          }
                                        </div>
                                      )}
                                      <div className="stacked-checkbox">
                                        <Field
                                          name={`questions.${index}.checks`}
                                          id={`Check-${index}`}
                                          items={[
                                            {
                                              isDisabled: readOnly,
                                              label: t('label.check.questionMandatory'),
                                              value: 'isMandatory'
                                            },
                                            {
                                              isDisabled: readOnly,
                                              label: t('label.check.requiredDocument'),
                                              value: 'isDocumentRequired'
                                            }
                                          ]}
                                          size="md"
                                          readonly={readOnly}
                                          component={CheckBox}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  {mode !== MODE.VIEW && (
                                    <div className="styled-icon-button">
                                      <Button
                                        onClick={() => {
                                          addQuestion(defaultQuestionTemplate);
                                        }}
                                        variant="tertiary"
                                        size="md"
                                        disabled={readOnly}
                                        Icon={PlusIcon}>
                                        {t('button.caption.addQuestion')}
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          }}
                        </FieldArray>
                      </div>
                    </div>
                    <div>
                      {mode !== MODE.VIEW && (
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
                      )}
                    </div>
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default AddQuestionnaire;
