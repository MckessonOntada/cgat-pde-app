import React from 'react';
import { Alert, Button, Heading } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import notificationConfig from './communication-preference-panel/config';
import SMSConfigurationPanel from './communication-preference-panel/SMSConfigurationPanel';
import style from './Style.module.scss';
import { useNavigate } from 'react-router-dom';
import UserService from '@src/api/commonService/UserService';
import CommonUtils from '@src/util/CommonUtils';
import { extractUserPreferences, getMergedPreferences } from './communication-preference-panel/helpers';
import NotificationPreferencePanel from './communication-preference-panel/NotificationPreferencePanel';
import AuthUtils from '@src/util/AuthUtils';
import { scrollToTopUtil } from '@src/components/scrollToTop/scrollUtils';

const VALIDATION_SCHEMA = Yup.object().shape({
  preferences: Yup.object()
});

const NotificationPreference = () => {
  const { t: translateFn } = useTranslate();
  const navigate = useNavigate();

  const [isInvitationDisabled, setIsInvitationDisabled] = React.useState(false);
  const [alert, setAlert] = React.useState(null);
  const [verificationStatus, setVerificationStatus] = React.useState({});
  const [isLoadingPreferences, setIsLoadingPreferences] = React.useState(true);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = React.useState(false);
  const [isLoadingVerification, setIsLoadingVerification] = React.useState(true);
  const timeoutRef = React.useRef();

  const [preferencesConfig, setPreferenceConfig] = React.useState(notificationConfig);

  React.useEffect(() => {
    UserService.getCommunicationPreferences()
      .then((preferences = {}) => {
        const userCommunicationPreferences = preferences.userCommunicationPreferences?.preferences || {},
          roleCommunicationPreferences = preferences.roleCommunicationPreferences?.preferences || {};
        const updatedConfig = getMergedPreferences(preferencesConfig, userCommunicationPreferences, roleCommunicationPreferences);
        setPreferenceConfig(updatedConfig);
        setIsPreferencesLoaded(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoadingPreferences(false);
      });
  }, []);

  React.useEffect(() => {
    const userId = AuthUtils.getLoggedInUserId();
    UserService.getSubscriptionDetails(userId)
      .then((data) => {
        setVerificationStatus({ ...data });
      })
      .catch((error) => {
        const statusCode = error?.response?.status;
        let description = translateFn('error.default');
        if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

        setAlert({
          description,
          type: 'error'
        });
      })
      .finally(() => {
        setIsLoadingVerification(false);
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
      .catch((error) => {
        setIsInvitationDisabled(false);
        const statusCode = error?.response?.status;
        let description = translateFn('error.default');
        if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

        setAlert({
          description,
          type: 'error'
        });
      });
  };

  const handleOnSubmit = (values) => {
    const payload = extractUserPreferences(values);
    UserService.setCommunicationPreferences(payload)
      .then((response) => {
        setAlert({
          description: 'Communication preferences updated successfully.',
          type: 'success'
        });
        scrollToTopUtil();
      })
      .catch((error) => {
        const statusCode = error?.response?.status;
        let description = translateFn('error.default');
        if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

        setAlert({
          description,
          type: 'error'
        });
        scrollToTopUtil();
      });
  };

  const handleBack = () => navigate(-1);

  const handleOnSaveNumber = (phoneNumber) => {
    const params = {
      number: phoneNumber,
      userType: AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL'
    };
    const userId = AuthUtils.getLoggedInUserId();
    UserService.subscribeSmsNotification(userId, params)
      .then(() => {
        setVerificationStatus({ ...verificationStatus, number: phoneNumber });
        setAlert({
          description: translateFn('smsSubscription.phoneNumberUpdated'),
          type: 'success'
        });
      })
      .catch((error) => {
        const statusCode = error?.response?.status;
        let description = translateFn('error.default');
        if (!(statusCode >= 400 && statusCode < 600)) description = CommonUtils.getAxiosErrorMessage(error);

        setAlert({
          description,
          type: 'error'
        });
      });
  };

  return (
    <div className="MCP-module-wrapper">
      <Formik initialValues={preferencesConfig} validationSchema={VALIDATION_SCHEMA} onSubmit={handleOnSubmit} enableReinitialize>
        {() => (
          <Form>
            <div className="MCP-module-body">
              <ModuleHeader heading={<Heading as="h1">{translateFn('heading.notificationSetting')}</Heading>} />

              {/* {verificationStatus.isNumberVerified === false && (
                <Alert
                  type="info"
                  showCloseIcon={false}
                  showTitle
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
              )} */}

              {alert && <Alert id="activity-alert" {...alert} showCloseIcon onClose={() => setAlert(null)} />}

              <div className="MCP-CardContainer">
                <NotificationPreferencePanel
                  readOnly={false}
                  showLabel={false}
                  showTooltip={true}
                  isPreferencesLoaded={isPreferencesLoaded}
                  isLoadingPreferences={isLoadingPreferences}
                  config={{ ...preferencesConfig, userPermissions: AuthUtils.getUserPermissions() }}
                />
                {/* <SettingPanelRenderer /> */}
                {/* <SMSConfigurationPanel
                  isLoadingVerification={isLoadingVerification}
                  linkedContactNumber={verificationStatus.number}
                  setAlert={setAlert}
                  onSave={handleOnSaveNumber}
                /> */}
              </div>

              <div className="controls">
                <Button size="md" variant="secondary" onClick={handleBack}>
                  {translateFn('captions.btnBack')}
                </Button>{' '}
                <Button disabled={isLoadingPreferences} size="md" variant="primary" type="submit">
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
