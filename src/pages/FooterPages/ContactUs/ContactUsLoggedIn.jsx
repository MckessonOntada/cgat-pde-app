import React, { useEffect, useState } from 'react';
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
import TechIssueForm from './TechIssueForm';
import OrderIssueForm from './OrderIssueForm';
import StepHeader from './StepHeader';
import { therapyOptions } from './constants';

const isTherapyCrosswalked = (therapyVal) => {
  const therapy = therapyOptions.find((t) => t.value === therapyVal);
  return therapy ? therapy.isCrosswalked : false;
};

const shouldShowDescription = (values) => {
  if (values.reason === 'tech') {
    return !!values.affectedModule;
  } else if (values.reason === 'order') {
    const isCrosswalked = isTherapyCrosswalked(values.therapy);
    if (isCrosswalked) {
      return !!values.therapy && !!values.orderingChannel && !!values.account;
    } else {
      return !!values.therapy && !!values.account;
    }
  } else if (values.reason === 'invoice' || values.reason === 'other') {
    return !!values.therapy && !!values.orderingChannel && !!values.account;
  }
  return false;
};

const getProgressState = (values) => {
  if (values.reason === 'tech') {
    return {
      totalSteps: 3,
      currentStep: values.affectedModule ? 3 : 2
    };
  }

  if (values.reason === 'order') {
    const isCrosswalked = isTherapyCrosswalked(values.therapy);
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
    } else {
      if (values.therapy && values.account) {
        currentStep = 4;
      }
    }
    return {
      totalSteps,
      currentStep
    };
  }

  //handle progressbar stepper for other three
  if (values.reason === 'invoice' || values.reason === 'other') {
    return {
      totalSteps: 5,
      currentStep: 2
    };
  }

  return {
    totalSteps: 3,
    currentStep: 1
  };
};

const canSubmit = (values) => {
  if (!values.reason) return false;

  if (values.reason === 'tech') {
    return !!values.affectedModule && !!values.description;
  }

  if (values.reason === 'order') {
    const isCrosswalked = isTherapyCrosswalked(values.therapy);
    if (isCrosswalked) {
      return !!values.therapy && !!values.orderingChannel && !!values.account && !!values.description;
    } else {
      return !!values.therapy && !!values.account && !!values.description;
    }
  }

  if (values.reason === 'invoice' || values.reason === 'other') {
    return !!values.therapy && !!values.orderingChannel && !!values.account && !!values.description;
  }

  return false;
};
const ContactUsLoggedIn = () => {
  restoreSessionTransfer();
  const { t } = useTranslate();
  const [searchParams] = useSearchParams();
  const nameFromUrl = searchParams.get('name');
  const fullName = nameFromUrl ? decodeURIComponent(nameFromUrl) : AuthUtils.getFullName() || AuthUtils.getUserName() || 'User';

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(fullName);

  return (
    <div className="contact-container">
      <PrimaryHeader />

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
              therapy: '',
              orderingChannel: '',
              account: '',
              description: ''
            }}
            onSubmit={(values) => console.log(values)}>
            {({ values }) => {
              const progress = getProgressState(values);

              return (
                <div className="contact-card-body">
                  <ProgressBarStepper totalSteps={progress.totalSteps} currentStep={progress.currentStep} />

                  <Heading as="h1" className="body-heading">
                    {t('footer.contactUs')}
                  </Heading>
                  <p className="body-subheading">{t('contactUs.subheading')}</p>

                  {/* Form */}
                  <Form>
                    <div>
                      <TabSelection />
                      {values.reason === 'tech' && <TechIssueForm />}
                      {values.reason === 'order' && <OrderIssueForm />}

                      {shouldShowDescription(values) && (
                        <>
                          <StepHeader
                            step={
                              values.reason === 'tech'
                                ? 3
                                : isTherapyCrosswalked(values.therapy)
                                  ? 5
                                  : 4
                            }
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
                </div>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ContactUsLoggedIn;
