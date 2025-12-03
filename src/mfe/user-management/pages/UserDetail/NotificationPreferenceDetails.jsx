import React from 'react';
import { Button, Heading, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ModuleHeader from '@src/components/module-header';
import notificationConfig from '@src/mfe/core-config/notifications-setting/communication-preference-panel/config';
import NotificationPreferencePanel from '@src/mfe/core-config/notifications-setting/communication-preference-panel/NotificationPreferencePanel';
import { Form, Formik } from 'formik';
import { extractUserPreferences, getMergedPreferences } from '@src/mfe/core-config/notifications-setting/communication-preference-panel/helpers';
import SMSConfigurationPanel from '@src/mfe/core-config/notifications-setting/communication-preference-panel/SMSConfigurationPanel';
import UserService from '@src/api/commonService/UserService';
import AuthUtils from '@src/util/AuthUtils';
import Alert from '@src/components/alert/Alert';
import useUser from '../../useUser';

function NotificationPreferenceConfiguration() {
  const { t: translateFn } = useTranslate();
  const location = useLocation();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [alert, setAlert] = React.useState(null);
  const [verificationStatus, setVerificationStatus] = React.useState({});

  const isSystemAdminView = AuthUtils.isSystemAdminView();
  const requestParams = {
    userType: isSystemAdminView ? 'ADMIN' : 'GENERAL'
  };

  const { isLoading, data: userDetails, refetch } = useUser(userId, requestParams);
  const [preferencesConfig, setPreferenceConfig] = React.useState(notificationConfig);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = React.useState(false);
  console.log(userDetails);
  React.useEffect(() => {
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
      });
  }, []);

  React.useEffect(() => {
    if (userDetails) {
      const userCommunicationPreferences = userDetails.userCommunicationPreferences ?? {};
      const roleCommunicationPreferences = userDetails.role?.communicationPreferences?.preferences;

      const updatedConfig = getMergedPreferences(preferencesConfig, userCommunicationPreferences.preferences, roleCommunicationPreferences);
      setPreferenceConfig(updatedConfig);
      setIsPreferencesLoaded(true);
    }
  }, [notificationConfig, userDetails]);
  const handleOnSubmit = (values) => {
    const payload = extractUserPreferences(values);
    const params = { userId };
    UserService.setCommunicationPreferences(payload, params)
      .then((response) => {
        navigate('./..', {
          state: {
            alert: {
              pinPoint: 'notification_preferences',
              description: translateFn('message.communicationPreferencesUpdated'),
              type: 'success'
            }
          }
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
  const handleOnSaveNumber = (phoneNumber) => {
    const params = {
      number: phoneNumber,
      userType: AuthUtils.isSystemAdminView() ? 'ADMIN' : 'GENERAL'
    };
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
  if (isLoading) {
    return <Loader type={'screen'} />;
  }
  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={() => navigate('./../')} size="md">
          {translateFn('Back to User Details')}
        </Button>
      </div>
      <Formik initialValues={preferencesConfig} enableReinitialize={true} onSubmit={handleOnSubmit}>
        <Form>
          <div className="MCP-module-body">
            <ModuleHeader heading={<Heading as="h2">{translateFn('Edit Communication Preferences')}</Heading>} />
            {alert && <Alert {...alert} onClose={() => setAlert(null)} />}
            <div className="MCP-CardContainer">
              <NotificationPreferencePanel
                readOnly={false}
                showLabels={true}
                isLoadingPreferences={false}
                isPreferencesLoaded={isPreferencesLoaded}
                config={{ ...preferencesConfig, userPermissions: userDetails.permissions }}
              />
              <SMSConfigurationPanel
                onSave={handleOnSaveNumber}
                isLoadingVerification={false}
                linkedContactNumber={verificationStatus.number}
                setAlert={setAlert}
              />
            </div>
            <div className="controls">
              <Button size="md" variant="secondary" onClick={() => navigate('./../')}>
                {translateFn('captions.btnBack')}
              </Button>{' '}
              <Button size="md" variant="primary" type="submit">
                {translateFn('button.caption.saveChanges')}
              </Button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default NotificationPreferenceConfiguration;
