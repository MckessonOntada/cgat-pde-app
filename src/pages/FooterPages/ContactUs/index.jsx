import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import { Button, Heading, CheckboxGroup } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import ModuleHeader from '@src/components/module-header';
import './index.scss';
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss';
import { useNavigate } from 'react-router-dom';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { handleApiError } from '@src/util/ApiUtils';
import Alert from '@src/components/cgat-alert/Alert';
import Components from '@src/components/form/Components';
import { ALPHABETIC_WITH_SPECIAL_AND_ACCENTED, PHONE_REGEX, ALPHA_NUMERIC_WITH_SPACE_HYPHEN_COMMA } from '@src/components/form/ValidationRegExp';
import CommonUtils from '@src/util/CommonUtils';
import style from '../Footer.module.scss';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/InspiroLink.svg';

const ContactUs = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleAlertClose = () => {
    setIsAlertVisible(false);
  };
  const [orderAgreementCheckboxError, setOrderAgreementCheckboxError] = React.useState(null);

  const [agreeCheckboxOptions, setAgreeCheckboxOptions] = React.useState({
    isDisabled: false,
    isChecked: false,
    label: t('messages.contactAcknowledgement'),
    value: false
  });
  const handleChange = () => {
    setOrderAgreementCheckboxError(null);
    setAgreeCheckboxOptions({
      ...agreeCheckboxOptions,
      isChecked: !agreeCheckboxOptions.isChecked
    });
  };
  //   const { mutate, isLoading } = useMutation(async ({ payload }) => {
  //     const res = await HttpResourceService.callRest(`${ApiRoutes.POST_SIGNUP_USER}`, httpVerb.POST, payload);
  //     return res.data;
  //   });

  const initialValues = {
    name: {
      firstName: '',
      lastName: ''
    },
    title: '',
    contact: {
      workEmail: '',
      phone: ''
    },
    company: '',
    tellUsMore: ''
  };

  const validationSchema = Yup.object({
    name: Yup.object({
      firstName: CommonUtils.getNameValidation(t, {
        field: 'first_name',
        required: true
      }),
      lastName: CommonUtils.getNameValidation(t, {
        field: 'last_name',
        required: true
      })
    }),
    title: Yup.string()
      .matches(ALPHABETIC_WITH_SPECIAL_AND_ACCENTED, t('forms.validation.textInput'))
      .max(50, t('forms.validation.max.title'))
      .required(t('forms.validation.required.title')),
    contact: Yup.object({
      workEmail: Yup.string()
        .email(t('userManagement.create_user.validation.invalid_email'))
        .required(t('userManagement.create_user.validation.email_required')),
      phone: Yup.string()
        .matches(PHONE_REGEX, t('userManagement.create_user.validation.phone_no'))
        .required(t('userManagement.create_user.validation.phone_no_required'))
    }),
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
      setOrderAgreementCheckboxError('Please acknowledge to submit the form');
      return;
    }

    if (agreeCheckboxOptions.isChecked) {
      console.log(values);
      navigate('/contact-success');
    }
    // const payload = {
    //   ...values,
    //   isActive: true
    // };
    // mutate(
    //   { payload },
    //   {
    //     onSuccess: (response) => {
    //       console.log('Form submitted successfully:', response);
    //       navigate('/');
    //     },
    //     onError: (error) => {
    //       const errorKey = handleApiError(error);
    //       setAlert({ type: 'error', message: t(errorKey) });
    //       setIsAlertVisible(true);
    //     }
    //   }
    // );
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
                    {isAlertVisible && <Alert description={alert.message} onClose={handleAlertClose} type={alert.type} />}
                    <div className="MCP-module-wrapper">
                      <div className="MCP-module-body form-container">
                        <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 align-items-baseline">
                          <Field
                            id="name.firstName"
                            name="name.firstName"
                            label={t('userManagement.create_user.inputLabel.first_name')}
                            placeholder=" "
                            isRequired
                            component={Components['input']}
                            maxLength={50}
                          />
                          <Field
                            name="name.lastName"
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
                            name="contact.workEmail"
                            label={t('userManagement.create_user.inputLabel.workEmail')}
                            placeholder=" "
                            isRequired
                            component={Components['input']}
                            maxLength={100}
                          />
                          <Field
                            name="contact.phone"
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
                            error={Boolean(orderAgreementCheckboxError)}
                            errorMessage={orderAgreementCheckboxError}
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
                    <Button size="md" variant="secondary" type="button" onClick={() => navigate('/')}>
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
