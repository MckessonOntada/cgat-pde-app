import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import AuthUtils from '@src/util/AuthUtils';
import { restoreSessionTransfer } from '@src/util/SessionTransferUtils';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/pagelogo.svg';
import { Heading } from '@mckesson/mcp-component-library';
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
import { PHONE_REGEX } from '@src/components/form/ValidationRegExp';

const isTherapyCrosswalked = (selectedTherapy) => {
  return selectedTherapy?.isCrosswalked ?? false;
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
    const isCrosswalked = isTherapyCrosswalked(values.selectedTherapy);
    const totalSteps = isCrosswalked ? 5 : 4;

    let currentStep = 2;

    if (values.therapy) {
      currentStep = 3;
    }

    if (isCrosswalked) {
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

const ContactUsLoggedIn = () => {
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
                  therapy: '',
                  orderingChannel: '',
                  account: '',
                  description: '',
                  ndcNumber: ''
                }}
                validateOnBlur={true}
                validateOnChange={true}
                validationSchema={!isAuthenticated ? personalDetailsSchema : undefined}
                onSubmit={(values) => {
                  mutate({ values });
                }}>
                {({ values, resetForm, validateForm, isValid }) => {
                  const progress = getProgressState(values);

                  return (
                    <div className={styles.contactCardBody}>
                      {submittedData ? (
                        <RequestSubmitted
                          submittedData={submittedData}
                          handleSubmitAnotherRequest={() => {
                            resetForm();
                            setSubmittedData(null);
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

                              {alert && alert.type && values.reason !== 1 && (
                                <div className={styles.formSectionGap}>
                                  <Alert description={alert.description} onClose={() => setAlert(null)} type={alert.type} showCloseIcon={false} />
                                </div>
                              )}
                              {values.reason === 1 && <TechIssueForm step={isAuthenticated ? 2 : 3} title={t('contactUs.affectedModule')} />}

                              {isAuthenticated && isTherapyBasedReason(values.reason) && (
                                <OrderIssueForm reason={values.reason} alert={alert} setAlert={setAlert} resetForm={resetForm} />
                              )}

                              {!alert && shouldShowDescription(values) && (
                                <>
                                  <StepHeader
                                    step={values.reason === 1 ? 3 : isTherapyCrosswalked(values.selectedTherapy) ? 5 : 4}
                                    title={t('contactUs.describeIssue')}
                                  />

                                  <div className={styles.descriptionWrapper}>
                                    <Field as="textarea" name="description" maxLength={1000} className={styles.descriptionField} />

                                    <div className={styles.descriptionCounter}>
                                      <span>{t('contactUs.maxCharacters')}</span>
                                      <span>({values.description.length}/1000)</span>
                                    </div>
                                  </div>
                                </>
                              )}

                              <div className={styles.submitButtonWrapper}>
                                <Button
                                  type="submit"
                                  className={styles.contactFormSubmitButton}
                                  variant="primary"
                                  size="md"
                                  disabled={!isAuthenticated ? !isValid || !canSubmit(values) || isLoading : !canSubmit(values) || isLoading}>
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
      </div>
    </div>
  );
};

export default ContactUsLoggedIn;
