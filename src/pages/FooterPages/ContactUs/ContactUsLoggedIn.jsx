import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import PrimaryHeader from '@src/components/header/PrimaryHeader';
import AuthUtils from '@src/util/AuthUtils';
import { ReactComponent as McKessonLogo } from '@src/assets/svg/pagelogo.svg';
import { Heading } from '@mckesson/mcp-component-library';
import './index.scss';
import { ProgressBarStepper } from '@src/components/stepper';
import { TabSelection } from './TabSelection';
import { Formik, Form, Field } from 'formik';
import { Button } from '@mckesson/mcp-component-library';
import TechIssueForm from './TechIssueForm';
import StepHeader from './StepHeader';

const shouldShowDescription = (values) => {
  if (values.reason === 'tech') {
    return !!values.affectedModule;
  } else if (values.reason === 'order' || values.reason === 'invoice' || values.reason === 'other') {
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

  //handle progressbar stepper for other three
  if (values.reason === 'order' || values.reason === 'invoice' || values.reason === 'other') {
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

  if (values.reason === 'order' || values.reason === 'invoice' || values.reason === 'other') {
    return !!values.therapy && !!values.orderingChannel && !!values.account && !!values.description;
  }

  return false;
};
const ContactUsLoggedIn = () => {
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
          <Formik initialValues={{ reason: '', affectedModule: '', description: '' }} onSubmit={(values) => console.log(values)}>
            {({ values }) => {
              const progress = getProgressState(values);

              return (
                <div className="contact-card-body">
                  <ProgressBarStepper totalSteps={progress.totalSteps} currentStep={progress.currentStep} />

                  <Heading as="h1" className="body-heading">
                    Contact Us
                  </Heading>
                  <p className="body-subheading">Tell us what you need help with and we'll route it to the right team.</p>

                  {/* Form */}
                  <Form>
                    <div>
                      {/* Tab */}
                      <TabSelection />
                      {/* form1 */}
                      {values.reason === 'tech' && <TechIssueForm />}

                      {/* form2 */}

                      {/* common description and submit button for form1 and form2 */}
                      {/* common description */}
                      {shouldShowDescription(values) && (
                        <>
                          <StepHeader step={3} title={'Describe the issue'} />
                          <div className="description-wrapper">
                            <Field as="textarea" name="description" maxLength={1000} className="description-field" />

                            <div className="description-counter">
                              <span>Maximum 1,000 Characters</span>
                              <span>({values.description.length}/1000)</span>
                            </div>
                          </div>
                        </>
                      )}

                      {/*  submit button */}
                      <div className="submit-button-wrapper">
                        <Button type="submit" className="contact-form-submit-button" variant="primary" size="md" disabled={!canSubmit(values)}>
                          Submit Request
                        </Button>
                      </div>
                      {/* form */}
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
