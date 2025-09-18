import { Alert, Button, Heading } from '@mckesson/mcp-component-library';
import { PHONE_REGEX } from '@src/components/form/ValidationRegExp';
import ModuleHeader from '@src/components/module-header';
import { useTranslate } from '@src/translations/useTranslation';
import { Form, Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import notificationConfig from './config';
import SettingPanelRenderer from './Renderer';
import SMSConfiguration from './SMSConfiguration';
import style from './Style.module.scss';

const SettingPanel = () => {
  const { t: translateFn } = useTranslate();
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

  const initialValues = {
    linkedContactNumber: '',
    subscribeSMSNotification: false,
    preferences: { ...notificationConfig }
  };

  const handleOnSubmit = (values) => {
    console.log('Form submitted:', values);
    //API submit here
  };

  return (
    <div className="MCP-module-wrapper">
      <Formik initialValues={initialValues} validationSchema={VALIDATION_SCHEMA} onSubmit={handleOnSubmit} enableReinitialize>
        {() => {
          return (
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
                              <a className={style['decorated-link']} href="#">
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
                  <Button
                    size="md"
                    variant="secondary"
                    onClick={() => {
                      // handle back navigation
                    }}>
                    {translateFn('captions.btnBack')}
                  </Button>{' '}
                  <Button size="md" variant="primary" type="submit">
                    {translateFn('button.caption.saveAsDraft')}
                  </Button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default SettingPanel;
