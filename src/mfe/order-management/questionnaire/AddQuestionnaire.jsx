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
import { closeModal, openModal } from '@src/store/reducer/modalReducer';
import { useDispatch } from 'react-redux';

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

const INITIAL_FORM_STATE = {
  templateName: '',
  questions: [
    {
      caption: { en: '', es: '', activeLanguage: LANGUAGE.ENGLISH },
      type: ''
    }
  ]
};

function AddQuestionnaire() {
  const { t } = useTranslate();
  const [mode, setMode] = React.useState(MODE.CREATE);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [initialFormState, setInitialFormState] = React.useState(INITIAL_FORM_STATE);

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
        questionOptions: Yup.array()
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

  React.useEffect(() => {
    if (id) {
      setMode(MODE.VIEW);
      // fetch questionnaire details by id
      // re-structure response
      // assign it initial state
    }
  }, []);

  const handleOnSubmit = (values, { setFieldError, setFieldValue }) => {
    const { templateName, questions } = values;

    //optionList validation
    let areQuestionValid = true;
    questions.forEach((question, questionIndex) => {
      if (question.type !== QUESTION_TYPE.INPUT) {
        const minimumOptionsIndex = {
          [QUESTION_TYPE.DROPDOWN]: 2,
          [QUESTION_TYPE.RADIO_BUTTON]: 2,
          [QUESTION_TYPE.CHECKBOX]: 1
        };
        if (!question.questionOptions || question.questionOptions.length < minimumOptionsIndex[question.type]) {
          alert('Options are enough');
          areQuestionValid = false;
        }

        question.questionOptions.forEach((option, optionIndex) => {
          if (!option.en) {
            areQuestionValid = false;
            setFieldValue(`questions.${questionIndex}.questionOptions.${optionIndex}.activeLanguage`, LANGUAGE.ENGLISH);
            setFieldError(`templateName`, 'at least requires english text');
            //questions.${questionIndex}.questionOptions.${optionIndex}
          }
        });
      }
    });

    if (!areQuestionValid) return;

    const payload = {};
    payload.templateName = templateName;
    if (questions && Array.isArray(questions)) {
      payload.questions = questions.map((question) => {
        const { checks, questionOptions, caption, type } = question;
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

        if (questionOptions)
          formattedQuestion.additionalAttributes = {
            options: questionOptions.map(({ en, es }) => ({ en, es }))
          };

        return formattedQuestion;
      });
    }

    console.log(payload);
  };

  const deactivateQuestionnaire = () => {};

  const handleOnDeactivateQuestionnaire = () => {
    if (selectedRows || selectedRows.length <= 0) {
      const state = {};
      state.title = 'Deactivate?';
      state.body = (
        <div className="MCP-modal-body">
          <p>Do you want to deactivate selected questionnaire templates?</p>
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
              deactivateQuestionnaire();
              dispatch(closeModal());
            }}>
            Yes
          </Button>
        </div>
      );
      dispatch(openModal(state));
    }
  };

  const readOnly = mode === MODE.VIEW;

  return (
    <div>
      <div>
        <Formik initialValues={initialFormState} onSubmit={handleOnSubmit} enableReinitialize validationSchema={schema}>
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

                    <div className="MCP-CardContainer">
                      <div className="template">
                        <div className="row-space-between-center">
                          <div className="styledHeading">
                            <Heading as="h2">{t('heading.templateDetails')}</Heading>
                          </div>
                          {mode !== MODE.CREATE && (
                            <div className="controls">
                              {mode !== MODE.EDIT && (
                                <Button variant="secondary" size="md" onClick={() => setMode(MODE.EDIT)}>
                                  Edit
                                </Button>
                              )}
                              <Button variant="secondary" size="md" onClick={handleOnDeactivateQuestionnaire}>
                                Deactivate
                              </Button>
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
                                            size="lg"
                                            onChange={(selectedType) => {
                                              setFieldValue(`questions[${index}].type`, selectedType);
                                              if (selectedType === QUESTION_TYPE.INPUT) {
                                                setFieldValue(`questions[${index}].questionOptions`, null);
                                              } else {
                                                setFieldValue(`questions[${index}].questionOptions`, [
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
                                              disabled={values['questions'].length === 1}
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
                                            name={`questions.${index}.caption['${question.caption.activeLanguage}']`}
                                            fieldlabel={t('label.question')}
                                            labelControls={
                                              <Field
                                                name={`questions.${index}.caption.activeLanguage`}
                                                options={['en', 'es']}
                                                size="small"
                                                value={question['caption']['activeLanguage']}
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
                                      {question['type'] && question.questionOptions && (
                                        <div className="template-form">
                                          {
                                            <FieldArray name={`questions.${index}.questionOptions`}>
                                              {({ push: addOption, remove: removeOption }) => {
                                                return (
                                                  <div className="options" key={`question-${index}`}>
                                                    <div className="option-list">
                                                      {question['questionOptions']?.map((option, optionIndex) => {
                                                        return (
                                                          <div key={`question-${index}-option-${optionIndex}`}>
                                                            <div className="grid grid-gap-24 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
                                                              <div className="styled-form-field">
                                                                <Field
                                                                  name={`questions.${index}.questionOptions.${optionIndex}.${option.activeLanguage}`}
                                                                  label={t('placeholder.optionItr') + (optionIndex + 1)}
                                                                  placeholder={t('placeholder.optionItr')}
                                                                  component={Components['input']}
                                                                  isRequired
                                                                  labelControls={
                                                                    <Field
                                                                      name={`questions.${index}.questionOptions.${optionIndex}.activeLanguage`}
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
                                      )}
                                      <div className="stacked-checkbox">
                                        <Field
                                          name={`questions.${index}.checks`}
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
                                        addQuestion({ type: '', caption: '', questionOptions: [] });
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
            );
          }}
        </Formik>
      </div>
    </div>
  );
}

export default AddQuestionnaire;
