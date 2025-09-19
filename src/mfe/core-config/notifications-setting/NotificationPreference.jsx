import React from 'react';
import { Alert, Button, Heading } from '@mckesson/mcp-component-library';
import { PHONE_REGEX } from '@src/components/form/ValidationRegExp';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import notificationConfig from './config';
import SettingPanelRenderer from './Renderer';
import SMSConfiguration from './SMSConfiguration';
import style from './Style.module.scss';
import { useNavigate } from 'react-router-dom';

const NotificationPreference = () => {
  const { t: translateFn } = useTranslate();
  const navigate = useNavigate();
  const [isInvitationAccepted, setIsInvitationAccepted] = React.useState(false);
  const [alert, setAlert] = React.useState(null);

  const VALIDATION_SCHEMA = React.useMemo(
    () =>
      Yup.object().shape({
        linkedContactNumber: Yup.string()
          .matches(PHONE_REGEX, translateFn('message.enterPhoneNumber'))
          .when('subscribeSMSNotification', {
            is: true,
            then: (schema) => schema.required(translateFn('message.phoneNumberRequired')),
            otherwise: (schema) => schema.notRequired()
          }),
        subscribeSMSNotification: Yup.boolean(),
        preferences: Yup.object()
      }),
    [translateFn]
  );

  const initialValues = React.useMemo(
    () => ({
      linkedContactNumber: '',
      subscribeSMSNotification: false,
      preferences: { ...notificationConfig }
    }),
    []
  );

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

              {!isInvitationAccepted && (
                <Alert
                  type="info"
                  showCloseIcon
                  showTitle
                  onClose={() => {}}
                  title={
                    <div>
                      <p>{translateFn('smsSubscriptionAlert.title1')}</p>
                      <p>{translateFn('smsSubscriptionAlert.title2')}</p>
                    </div>
                  }
                  description={
                    <div>
                      <p>{translateFn('smsSubscriptionAlert.description1')}</p>
                      <p>
                        {translateFn('smsSubscriptionAlert.description2', {
                          link: (
                            <a key="resend-link" className={style['decorated-link']} href="#">
                              {translateFn('smsSubscriptionAlert.resendInvite')}
                            </a>
                          ),
                          lastSent: new Date().toISOString()
                        })}
                      </p>
                    </div>
                  }
                />
              )}

              {alert && <Alert id="activity-alert" {...alert} showCloseIcon onClose={() => setAlert(null)} />}

              <div className="MCP-CardContainer">
                <SettingPanelRenderer config={notificationConfig} />
                <SMSConfiguration />
              </div>

              <div className="controls">
                <Button size="md" variant="secondary" onClick={handleBack}>
                  {translateFn('captions.btnBack')}
                </Button>{' '}
                <Button size="md" variant="primary" type="submit">
                  {translateFn('button.caption.saveAsDraft')}
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
