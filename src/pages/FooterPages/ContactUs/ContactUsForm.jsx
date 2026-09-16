import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import AuthUtils from '@src/util/AuthUtils';
import { restoreSessionTransfer } from '@src/util/SessionTransferUtils';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/pagelogo.svg';
import { Heading, Loader } from '@mckesson/mcp-component-library';
import styles from './ContactUs.module.scss';
import { ProgressBarStepper } from '@src/components/stepper';
import { TabSelection } from './TabSelection';
import { Formik, Form, Field } from 'formik';
import { Button } from '@mckesson/mcp-component-library';
import StepHeader from './StepHeader';
import TechIssueForm from './TechIssueForm/Index';
import OrderIssueForm from './OrderIssueForm/Index';
import { useMutation } from 'react-query';
import RequestSubmitted from './submittedPage';
import { contactReasons, techIssueOptions } from './constants';
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss';
import UserService from '@src/api/commonService/UserService';
import Alert from '@src/components/cgat-alert/Alert';
import { useOktaAuth } from '@okta/okta-react';
import PersonalDetails from './PersonalDetails';
import * as Yup from 'yup';
import { CONTACT_US_DESCRIPTION_REGEX, PHONE_REGEX } from '@src/components/form/ValidationRegExp';
import Components from '@src/components/form/Components';
import Footer from '@src/components/footer';

const isTherapyCrosswalked = (selectedTherapy) => {
  return selectedTherapy?.isCrosswalked ?? false;
};

const showOrderingChannelStep = (values) => {
  return values.selectedTherapy?.isCrosswalked === true && (values.channelConfig?.channels?.length ?? 0) > 1;
};

const isTherapyBasedReason = (reason) => {
  return [2, 3, 4].includes(reason);
};

const shouldShowDescription = (values) => {
  if (values.reason === 1) {
    return !!values.affectedModule;
  }

  if (isTherapyBasedReason(values.reason)) {
    const isCrosswalked = isTherapyCrosswalked(values.selectedTherapy);
    if (isCrosswalked) {
      return !!values.therapy && !!values.orderingChannel && !!values.account;
    }
    return !!values.therapy && !!values.account;
  }

  return false;
};

const getProgressState = (values) => {
  if (values.reason === 1) {
    return {
      totalSteps: 3,
      currentStep: values.affectedModule ? 3 : 2
    };
  }

  if (isTherapyBasedReason(values.reason)) {
    const hasOrderingChannelStep = showOrderingChannelStep(values);
    const totalSteps = hasOrderingChannelStep ? 5 : 4;

    let currentStep = 2;

    if (values.therapy) {
      currentStep = 3;
    }

    if (hasOrderingChannelStep) {
      if (values.therapy && values.orderingChannel) {
        currentStep = 4;
      }

      if (values.therapy && values.orderingChannel && values.account) {
        currentStep = 5;
      }
    } else if (values.therapy && values.account) {
      currentStep = 4;
    }

    return {
      totalSteps,
      currentStep
    };
  }

  return {
    totalSteps: 3,
    currentStep: 1
  };
};

const canSubmit = (values) => {
  if (!values.reason) return false;

  if (values.reason === 1) {
    return !!values.affectedModule && !!values.description;
  }

  if (isTherapyBasedReason(values.reason)) {
    const isCrosswalked = isTherapyCrosswalked(values.selectedTherapy);
    if (isCrosswalked) {
      return !!values.therapy && !!values.orderingChannel && !!values.account && !!values.description;
    }

    return !!values.therapy && !!values.account && !!values.description;
  }

  return false;
};

const ContactUsForm = () => {
  restoreSessionTransfer();
  const { authState } = useOktaAuth() || {};
  const isAuthenticated = authState?.isAuthenticated;
  const { t } = useTranslate();
  const [searchParams] = useSearchParams();

  const nameFromUrl = searchParams.get('name');
  const fullName = nameFromUrl ? decodeURIComponent(nameFromUrl) : AuthUtils.getFullName() || AuthUtils.getUserName() || 'User';
  const [submittedData, setSubmittedData] = React.useState(null);
  const [alert, setAlert] = React.useState(null);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  const initials = getInitials(fullName);
  const buildContactUsPayload = (values) => {
    const selectedReason = contactReasons.find((r) => r.id === values.reason);
    const selectedModule = techIssueOptions.find((m) => m.id === values.affectedModule);

    const payload = {
      category: selectedReason?.value,
      subCategory: values?.reason === 1 ? selectedModule?.value : null,
      comments: values?.description || null
    };

    if (!isAuthenticated) {
      return {
        firstName: values.firstName,
        lastName: values.lastName,
        workEmail: values.email,
        phoneNumber: values.phoneNumber,
        ...payload
      };
    }

    return {
      ...payload,
      therapy: values?.selectedTherapy?.label || null,
      account: values?.account || null,
      channel: values?.selectedAccount?.salesOrg || null,
      ndcNumber: values?.ndcNumber || null
    };
  };

  const { mutate, isLoading } = useMutation(
    async ({ values }) => {
      const payload = buildContactUsPayload(values);
      const data = await UserService.contactUs(payload);
      setSubmittedData(data);
      return data;
    },
    {
      onSuccess: (data) => {
        setSubmittedData(data);
        setAlert(null);
        scrollToTopUtil();
      },
      onError: () => {
        setAlert({
          type: 'error',
          key: 'SUBMIT_ERROR',
          description: 'errors.default'
        });
      }
    }
  );
  const personalDetailsSchema = Yup.object({
    firstName: Yup.string().trim().required(t('contactUs.validation.firstNameRequired')).max(50, 'Maximum 50 characters'),
    lastName: Yup.string().trim().required(t('contactUs.validation.lastNameRequired')).max(50, 'Maximum 50 characters'),
    email: Yup.string()
      .trim()
      .email(t('contactUs.validation.invalidEmail'))
      .required(t('contactUs.validation.emailRequired'))
      .max(50, t('contactUs.validation.emailMax')),
    phoneNumber: Yup.string().matches(PHONE_REGEX, t('contactUs.validation.invalidPhone')).required(t('contactUs.validation.phoneNumberRequired'))
  });

  const contactUsSchema = Yup.object({
    description: Yup.string().matches(CONTACT_US_DESCRIPTION_REGEX, t('contactUs.validation.description'))
  }).concat(isAuthenticated ? Yup.object() : personalDetailsSchema);

  if (!authState) {
    return <Loader type={'screen'} />;
  }

  return (
    <div className={mainLayoutStyles.appContainer}>
      <PrimaryHeader />

      <div className={mainLayoutStyles['app-wrapper']}>
        <div className={styles.contactContainer}>
          <div className={styles.contactContent}>
            <div className={styles.contactCard}>
              <div className={`${styles.contactCardHeader} ${!isAuthenticated ? styles.nonLoggedInHeader : ''}`}>
                <div>
                  <McKessonLogo aria-hidden="true" focusable="false" />
                </div>

                {isAuthenticated && (
                  <div className={styles.userProfileSection}>
                    <div className={styles.userAvatar}>{initials}</div>

                    <div className={styles.userDetails}>
                      <span className={styles.userName}>{fullName}</span>

                      <span className={styles.userStatus}>{t('contactUs.signedIn')}</span>
                    </div>
                  </div>
                )}
              </div>

              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  phoneNumber: '',
                  reason: '',
                  affectedModule: '',
                  selectedTherapy: null,
                  selectedAccount: null,
                  channelConfig: null,
                  therapy: '',
                  orderingChannel: '',
                  account: '',
                  description: '',
                  ndcNumber: ''
                }}
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={contactUsSchema}
                onSubmit={(values) => {
                  mutate({ values });
                }}>
                {({ values, resetForm, validateForm, isValid, setFieldValue, setFieldTouched }) => {
                  const progress = getProgressState(values);

                  return (
                    <div className={styles.contactCardBody}>
                      {submittedData ? (
                        <RequestSubmitted
                          submittedData={submittedData}
                          handleSubmitAnotherRequest={() => {
                            resetForm();
                            setSubmittedData(null);
                            setAlert(null);
                          }}
                        />
                      ) : (
                        <>
                          {isAuthenticated ? (
                            <ProgressBarStepper totalSteps={progress.totalSteps} currentStep={progress.currentStep} />
                          ) : (
                            <div className={styles.formSectionGap}>
                              <Alert description={t('contactUs.nonLoggedIn.infoAlertMessage')} type="info" showCloseIcon={false} />
                            </div>
                          )}

                          <Heading as="h1" className={styles.bodyHeading}>
                            {t('footer.contactUs')}
                          </Heading>

                          <p className={styles.bodySubheading}>{t('contactUs.subheading')}</p>

                          <Form>
                            <div>
                              {!isAuthenticated && (
                                <div
                                  onBlur={() => {
                                    validateForm();
                                  }}>
                                  <PersonalDetails step={1} />
                                </div>
                              )}
                              {<TabSelection setAlert={setAlert} alert={alert} isAuthenticated={isAuthenticated} />}
                              {alert && (
                                <div className={styles.formSectionGap}>
                                  <Alert description={t(alert.description)} onClose={() => setAlert(null)} type={alert.type} showCloseIcon={false} />
                                </div>
                              )}

                              {values.reason === 1 && <TechIssueForm step={isAuthenticated ? 2 : 3} title={t('contactUs.affectedModule')} />}

                              {isAuthenticated && isTherapyBasedReason(values.reason) && (
                                <OrderIssueForm reason={values.reason} alert={alert} setAlert={setAlert} resetForm={resetForm} />
                              )}

                              {shouldShowDescription(values) && (
                                <>
                                  <StepHeader
                                    step={values.reason === 1 ? (isAuthenticated ? 3 : 4) : showOrderingChannelStep(values) ? 5 : 4}
                                    title={t('contactUs.describeIssue')}
                                  />

                                  <div className={styles.formSectionGap}>
                                    <Field
                                      id="description"
                                      name="description"
                                      component={Components['textarea']}
                                      maxCharLimit={1000}
                                      onChange={(value) => {
                                        setFieldValue('description', value);
                                        setFieldTouched('description', true, false);
                                      }}
                                      maxCharHelperText={t('contactUs.maxCharacters')}
                                      minRows={5}
                                    />
                                  </div>
                                </>
                              )}

                              <div className={styles.submitButtonWrapper}>
                                <Button
                                  type="submit"
                                  className={styles.contactFormSubmitButton}
                                  variant="primary"
                                  size="md"
                                  disabled={!isValid || !canSubmit(values) || isLoading}>
                                  {t('contactUs.submitRequest')}
                                </Button>
                              </div>
                            </div>
                          </Form>
                        </>
                      )}
                    </div>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ContactUsForm;
