import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Button, Heading, CheckboxGroup } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './index.scss';
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss';
import { useNavigate } from 'react-router-dom';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import Alert from '@src/components/cgat-alert/Alert';
import Components from '@src/components/form/Components';
import { ALPHABETIC_WITH_SPECIAL_AND_ACCENTED, PHONE_REGEX, ALPHA_NUMERIC_WITH_SPACE_HYPHEN_COMMA } from '@src/components/form/ValidationRegExp';
import CommonUtils from '@src/util/CommonUtils';
import style from '../Footer.module.scss';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/InspiroLink.svg';

const ContactUs = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [contactUsConsent, setContactUsConsent] = React.useState(null);
  const [agreeCheckboxOptions, setAgreeCheckboxOptions] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('messages.contactAcknowledgement'),
    value: false
  });

  const handleChange = () => {
    setContactUsConsent(null);
    setAgreeCheckboxOptions({
      ...agreeCheckboxOptions,
      isChecked: !agreeCheckboxOptions.isChecked
    });
  };
  const { mutate, isLoading } = useMutation(async ({ values }) => {
    const res = await HttpResourceService.callRest(`${ApiRoutes.USER_SERVICE_BASE}contact-us`, httpVerb.POST, values);
    return res.data;
  });

  const initialValues = {
    firstName: '',
    lastName: '',
    title: '',
    workEmail: '',
    phoneNumber: '',
    company: '',
    tellUsMore: ''
  };

  const validationSchema = Yup.object({
    firstName: CommonUtils.getNameValidation(t, {
      field: 'first_name',
      required: true,
      invalidKey: t('forms.validation.firstNameRequired')
    }),
    lastName: CommonUtils.getNameValidation(t, {
      field: 'last_name',
      required: true,
      invalidKey: t('forms.validation.lastNameRequired')
    }),
    title: Yup.string()
      .matches(ALPHA_NUMERIC_WITH_SPACE_HYPHEN_COMMA, t('forms.validation.textInput'))
      .max(50, t('forms.validation.max.title'))
      .required(t('forms.validation.required.title')),

    workEmail: Yup.string().email(t('forms.validation.invalidEmail')).required(t('forms.validation.emailRequired')),
    phoneNumber: Yup.string().matches(PHONE_REGEX, t('forms.validation.invalidPhoneNo')).required(t('forms.validation.phoneNoRequired')),

    company: Yup.string()
      .matches(ALPHA_NUMERIC_WITH_SPACE_HYPHEN_COMMA, t('forms.validation.textInput'))
      .max(50, t('forms.validation.max.company'))
      .required(t('forms.validation.required.company')),
    tellUsMore: Yup.string()
      .matches(ALPHA_NUMERIC_WITH_SPACE_HYPHEN_COMMA, t('forms.validation.textInput'))
      .max(2000, t('forms.validation.tellUsMoreExceedChar'))
      .nullable()
  });

  const handleSubmit = (values) => {
    if (!agreeCheckboxOptions.isChecked) {
      setContactUsConsent('Please acknowledge to submit the form');
      return;
    }

    if (agreeCheckboxOptions.isChecked) {
      mutate(
        { values },
        {
          onSuccess: (response) => {
            console.log('Form submitted successfully:', response);
            navigate('/contact-success');
          },
          onError: (error) => {
            setAlert({ type: 'error', message: t('errors.default') });
          }
        }
      );
    }
  };

  return (
    <div className={mainLayoutStyles.appContainer}>
      <PrimaryHeader />
      <div className={`${mainLayoutStyles['app-wrapper']}`}>
        <div className={`${mainLayoutStyles.home} max-container`}>
          <div className="MCP-module-wrapper">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, actions) => {
                handleSubmit(values);
                actions.setSubmitting(false);
              }}>
              {() => (
                <Form>
                  <div className="MCP-panel-container">
                    <div className={style.contantHeading}>
                      <McKessonLogo aria-hidden="true" focusable="false" title={'company.logoAltText'} />
                      <Heading as="h1">{t('footer.contactUs')}</Heading>
                    </div>
                    {alert && <Alert description={alert.message} onClose={() => setAlert(null)} type={alert.type} />}
                    <div className="MCP-module-wrapper">
                      <div className="MCP-module-body form-container">
                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
                          <Field
                            id="firstName"
                            name="firstName"
                            label={t('userManagement.create_user.inputLabel.first_name')}
                            placeholder=" "
                            isRequired
                            component={Components['input']}
                            maxLength={50}
                          />
                          <Field
                            name="lastName"
                            label={t('userManagement.create_user.inputLabel.last_name')}
                            placeholder=" "
                            isRequired
                            component={Components['input']}
                            maxLength={50}
                          />
                          <Field
                            id="title"
                            name="title"
                            label={t('userManagement.create_user.inputLabel.Title')}
                            placeholder=" "
                            component={Components['input']}
                            maxLength={50}
                            isRequired
                          />
                        </div>
                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
                          <Field
                            name="workEmail"
                            label={t('userManagement.create_user.inputLabel.workEmail')}
                            placeholder=" "
                            isRequired
                            component={Components['input']}
                            maxLength={100}
                          />
                          <Field
                            name="phoneNumber"
                            label={t('userManagement.create_user.inputLabel.phone_no')}
                            component={Components['phoneInput']}
                            className={'phoneInput'}
                            placeholder=" "
                            isRequired
                          />
                          <Field
                            name="company"
                            label={t('userManagement.create_user.inputLabel.Company')}
                            placeholder=" "
                            component={Components['input']}
                            maxLength={50}
                            isRequired
                          />
                        </div>
                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1">
                          <Field
                            name="tellUsMore"
                            fieldlabel={t('forms.labels.tellUsMore')}
                            placeholder=" "
                            component={Components['textarea']}
                            maxCharHelperText={t('forms.placeholder.max_2000_chars')}
                            maxCharLimit={2000}
                          />
                        </div>
                        <div className="MCP-module-body agreement-checkbox-control">
                          <CheckboxGroup
                            id={'default'}
                            name="agreement"
                            error={Boolean(contactUsConsent)}
                            errorMessage={contactUsConsent}
                            items={[
                              {
                                ...agreeCheckboxOptions,
                                onChange: () => handleChange()
                              }
                            ]}
                            size="md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={'buttonGroup'}>
                    <Button size="md" variant="secondary" type="button" onClick={() => window.close()}>
                      {t('forms.buttons.cancel')}
                    </Button>
                    <Button type="submit" variant="primary" size="md">
                      {t('prompt.action.submit')}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
