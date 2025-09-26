import React from 'react';
import { Alert, Button, Heading } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import notificationConfig from './config';
import SettingPanelRenderer from './Renderer';
import SMSConfiguration from './SMSConfiguration';
import style from './Style.module.scss';
import { useNavigate } from 'react-router-dom';
import UserService from '@src/api/commonService/UserService';

const VALIDATION_SCHEMA = Yup.object().shape({
  preferences: Yup.object()
});

const initialValues = {
  preferences: { ...notificationConfig }
};

const NotificationPreference = () => {
  const { t: translateFn } = useTranslate();
  const navigate = useNavigate();

  const [isInvitationDisabled, setIsInvitationDisabled] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [verificationStatus, setVerificationStatus] = React.useState({});

  const timeoutRef = React.useRef();

  React.useEffect(() => {
    UserService.getSubscriptionDetails()
      .then((data) => {
        setVerificationStatus({ ...data });
      })
      .catch((error) => {
        setAlert({ description: error.message, type: 'error' });
      });

    return () => clearTimeout(timeoutRef.current);
  }, []);

  React.useEffect(() => {
    if (!verificationStatus.lastResendSMSTime) return;

    const last = new Date(verificationStatus.lastResendSMSTime).getTime();
    const remaining = last + 30_000 - Date.now();

    if (remaining > 0) {
      setIsInvitationDisabled(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsInvitationDisabled(false), remaining);
    } else {
      setIsInvitationDisabled(false);
    }

    return () => clearTimeout(timeoutRef.current);
  }, [verificationStatus.lastResendSMSTime]);

  const resendInvitation = () => {
    setIsInvitationDisabled(true);
    UserService.resendInvitation()
      .then((lastResendSMSTime) => {
        setVerificationStatus((prev) => ({
          ...prev,
          lastResendSMSTime: lastResendSMSTime ?? prev.lastResendSMSTime
        }));
        setAlert({
          description: translateFn('message.resendInvitationSuccess'),
          type: 'success'
        });
      })
      .catch(() => {
        setIsInvitationDisabled(false);
        setAlert({
          description: translateFn('message.resendInvitationError'),
          type: 'error'
        });
      });
  };

  const handleOnSubmit = React.useCallback((values) => {
    console.log('Form submitted:', values);
    // API submit here
  }, []);

  const handleBack = () => navigate(-1);

  return (
    <div className="MCP-module-wrapper">
      <Formik initialValues={initialValues} validationSchema={VALIDATION_SCHEMA} onSubmit={handleOnSubmit} enableReinitialize>
        {() => (
          <Form>
            <div className="MCP-module-body">
              <ModuleHeader heading={<Heading as="h1">{translateFn('heading.notificationSetting')}</Heading>} />

              {verificationStatus.isNumberVerified === false && (
                <Alert
                  type="info"
                  showCloseIcon
                  showTitle
                  onClose={() => {}}
                  title={
                    <div>
                      <p>{translateFn('smsSubscriptionAlert.title1')}</p>
                      <p>{translateFn('smsSubscriptionAlert.title2', { number: verificationStatus.number })}</p>
                    </div>
                  }
                  description={
                    <div>
                      <p>{translateFn('smsSubscriptionAlert.description1')}</p>
                      <p>
                        {translateFn('smsSubscriptionAlert.description2', {
                          link: (
                            <button
                              type="button"
                              disabled={isInvitationDisabled}
                              key="resend-link"
                              className={style['decorated-link']}
                              onClick={resendInvitation}>
                              {translateFn('smsSubscriptionAlert.resendInvite')}
                            </button>
                          ),
                          lastSent: verificationStatus.lastResendSMSTime ? new Date(verificationStatus.lastResendSMSTime).toLocaleString() : ''
                        })}
                      </p>
                    </div>
                  }
                />
              )}

              {alert && <Alert id="activity-alert" {...alert} showCloseIcon onClose={() => setAlert(null)} />}

              <div className="MCP-CardContainer">
                <SettingPanelRenderer config={notificationConfig} />
                <SMSConfiguration
                  setLinkedNumber={(phone) => setVerificationStatus({ ...verificationStatus, number: phone })}
                  linkedContactNumber={verificationStatus.number}
                  setAlert={setAlert}
                />
              </div>

              <div className="controls">
                <Button size="md" variant="secondary" onClick={handleBack}>
                  {translateFn('captions.btnBack')}
                </Button>{' '}
                <Button size="md" variant="primary" type="submit">
                  {translateFn('button.caption.saveChanges')}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NotificationPreference;
