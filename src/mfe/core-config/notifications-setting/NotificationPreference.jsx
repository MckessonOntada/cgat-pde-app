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
import CommonUtils from '@src/util/CommonUtils';

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
        const optionMap = ['email', 'inApp', 'sms'];

        const updatedConfig = {
          ...preferencesConfig,
          sections: preferencesConfig.sections.map((section) => {
            const userSection = userCommunicationPreferences[section.id] || {};
            const roleSection = roleCommunicationPreferences[section.id] || {};

            if (section.rows) {
              return {
                ...section,
                rows: section.rows.map((row) => {
                  const userRow = userSection[row.id] || {};
                  const roleRow = roleSection[row.id] || {};

                  const optionValues = row.optionValues.map((opt, idx) => {
                    const channel = optionMap[idx];

                    const updatedOptions = { ...opt };
                    updatedOptions.value = userRow[channel] ?? opt.value;
                    if (roleRow[channel] === true) {
                      updatedOptions.value = true;
                      updatedOptions.isPreferred = true;
                    }

                    return updatedOptions;
                  });

                  return { ...row, optionValues };
                })
              };
            }

            if (section.optionValues) {
              const userRow = userSection['PROCESS_UPDATES'] || {};
              const roleRow = roleSection['PROCESS_UPDATES'] || {};

              const optionValues = section.optionValues.map((opt, idx) => {
                const channel = optionMap[idx];
                const updatedOptions = { ...opt };
                updatedOptions.value = userRow[channel] ?? opt.value;
                if (roleRow[channel] === true) {
                  updatedOptions.value = true;
                  updatedOptions.isPreferred = true;
                }

                return updatedOptions;
              });

              return { ...section, optionValues };
            }

            return section;
          })
        };
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
    UserService.getSubscriptionDetails()
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

  function extractUserPreferences(preferencesConfig) {
    const optionMap = ['email', 'inApp', 'sms'];
    const preferences = {};

    preferencesConfig.sections.forEach((section) => {
      if (section.rows) {
        preferences[section.id] = {};

        section.rows.forEach((row) => {
          const userRow = {};

          row.optionValues.forEach((opt, idx) => {
            const channel = optionMap[idx];
            userRow[channel] = opt.value;
          });

          preferences[section.id][row.id] = userRow;
        });
      }

      if (section.optionValues) {
        const userRow = {};
        section.optionValues.forEach((opt, idx) => {
          const channel = optionMap[idx];
          userRow[channel] = opt.value;
        });
        preferences[section.id] = { PROCESS_UPDATES: userRow };
      }
    });

    return { preferences };
  }

  const handleOnSubmit = (values) => {
    const payload = extractUserPreferences(values);
    UserService.setCommunicationPreferences(payload)
      .then((response) => {
        setAlert({
          description: 'Communication preferences updated successfully.',
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

  const handleBack = () => navigate(-1);

  return (
    <div className="MCP-module-wrapper">
      <Formik initialValues={preferencesConfig} validationSchema={VALIDATION_SCHEMA} onSubmit={handleOnSubmit} enableReinitialize>
        {() => (
          <Form>
            <div className="MCP-module-body">
              <ModuleHeader heading={<Heading as="h1">{translateFn('heading.notificationSetting')}</Heading>} />

              {verificationStatus.isNumberVerified === false && (
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
              )}

              {alert && <Alert id="activity-alert" {...alert} showCloseIcon onClose={() => setAlert(null)} />}

              <div className="MCP-CardContainer">
                <SettingPanelRenderer isPreferencesLoaded={isPreferencesLoaded} isLoadingPreferences={isLoadingPreferences} config={preferencesConfig} />
                <SMSConfiguration
                  isLoadingVerification={isLoadingVerification}
                  setLinkedNumber={(phone) => setVerificationStatus({ ...verificationStatus, number: phone })}
                  linkedContactNumber={verificationStatus.number}
                  setAlert={setAlert}
                />
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
