import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import AuthUtils from '@src/util/AuthUtils';
import { restoreSessionTransfer } from '@src/util/SessionTransferUtils';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/pagelogo.svg';
import { Heading } from '@mckesson/mcp-component-library';
import './index.scss';
import { ProgressBarStepper } from '@src/components/stepper';
import { TabSelection } from './TabSelection';
import { Formik, Form, Field } from 'formik';
import { Button } from '@mckesson/mcp-component-library';
import StepHeader from './StepHeader';
import TechIssueForm from './TechIssueForm/Index';
import OrderIssueForm from './OrderIssueForm/Index';
import { useMutation } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import RequestSubmitted from './submittedPage';
import { contactReasons, techIssueOptions } from './constants';
import mainLayoutStyles from '@src/assets/styles/MainLayout.module.scss';

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
  const { t } = useTranslate();
  const [searchParams] = useSearchParams();

  const nameFromUrl = searchParams.get('name');
  const fullName = nameFromUrl ? decodeURIComponent(nameFromUrl) : AuthUtils.getFullName() || AuthUtils.getUserName() || 'User';
  const [submittedData, setSubmittedData] = React.useState(null);

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
    return {
      category: selectedReason?.value,
      subCategory: values?.reason === 1 ? selectedModule?.value : selectedReason?.value,
      therapy: values?.selectedTherapy?.label || '',
      account: values?.account || '',
      channel: values?.selectedAccount?.salesOrg || '',
      comments: values?.description || ''
    };
  };
  const { mutate, isLoading } = useMutation(
    async ({ values }) => {
      const payload = buildContactUsPayload(values);
      const res = await HttpResourceService.callRest(`${ApiRoutes.USER_SERVICE_BASE}contact-us`, httpVerb.POST, payload);
      setSubmittedData(res.data);
      return res.data;
    },
    {
      onSuccess: (data) => {
        setSubmittedData(data);
      }
    }
  );

  return (
    <div className={mainLayoutStyles.appContainer}>
      <PrimaryHeader />

      <div className={mainLayoutStyles['app-wrapper']}>
        <div className="contact-container">
          <div className="contact-content">
            <div className="contact-card">
              <div className="contact-card-header">
                <div className="logo-section">
                  <McKessonLogo aria-hidden="true" focusable="false" className="brand-logo" />
                </div>

                <div className="user-profile-section">
                  <div className="user-avatar">{initials}</div>
                  <div className="user-details">
                    <span className="user-name">{fullName}</span>
                    <span className="user-status">Signed in</span>
                  </div>
                </div>
              </div>

              <Formik
                initialValues={{
                  reason: '',
                  affectedModule: '',
                  selectedTherapy: null,
                  selectedAccount: null,
                  therapy: '',
                  orderingChannel: '',
                  account: '',
                  description: ''
                }}
                onSubmit={(values) => {
                  mutate({ values });
                }}>
                {({ values, resetForm }) => {
                  const progress = getProgressState(values);

                  return (
                    <div className="contact-card-body">
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
                          <ProgressBarStepper totalSteps={progress.totalSteps} currentStep={progress.currentStep} />

                          <Heading as="h1" className="body-heading">
                            {t('footer.contactUs')}
                          </Heading>

                          <p className="body-subheading">{t('contactUs.subheading')}</p>

                          <Form>
                            <div>
                              <TabSelection />

                              {values.reason === 1 && <TechIssueForm />}

                              {isTherapyBasedReason(values.reason) && <OrderIssueForm key={values.reason} />}

                              {shouldShowDescription(values) && (
                                <>
                                  <StepHeader
                                    step={values.reason === 1 ? 3 : isTherapyCrosswalked(values.selectedTherapy) ? 5 : 4}
                                    title={t('contactUs.describeIssue')}
                                  />

                                  <div className="description-wrapper">
                                    <Field as="textarea" name="description" maxLength={1000} className="description-field" />

                                    <div className="description-counter">
                                      <span>{t('contactUs.maxCharacters')}</span>
                                      <span>({values.description.length}/1000)</span>
                                    </div>
                                  </div>
                                </>
                              )}

                              <div className="submit-button-wrapper">
                                <Button type="submit" className="contact-form-submit-button" variant="primary" size="md" disabled={!canSubmit(values)}>
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
