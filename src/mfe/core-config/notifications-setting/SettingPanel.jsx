import ModuleHeader from '@src/components/module-header';
import { Heading, Alert, Button } from '@mckesson/mcp-component-library';
import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import notificationConfig from './config';
import SettingPanelRenderer from './Renderer';
import SMSConfiguration from './SMSConfiguration';
import { Formik } from 'formik';

function SettingPanel() {
  const { t: translateFn } = useTranslate();
  const [formValues, setFormValues] = React.useState({
    linkedContactNumber: '',
    preferences: {}
  });
  React.useEffect(() => {
    //api call to fetch data
    //set response to form values
  }, []);
  const handleOnSubmit = (values) => {};

  return (
    <div className="MCP-module-wrapper">
      <Formik initialValues={formValues} handleSubmit={handleOnSubmit}>
        {({ values, setFieldValue }) => {
          return (
            <div className="MCP-module-body">
              <ModuleHeader heading={<Heading as="h1">{translateFn('heading.notificationSetting')}</Heading>} />
              <Alert
                type="info"
                showCloseIcon
                showTitle
                onClose={() => {}}
                title={
                  <div>
                    <p>You are not receiving SMS notifications yet!</p>
                    <p>An SMS invitation has been sent to 761-289-7654. Please reply via SMS to fully opt into SMS notifications.</p>
                  </div>
                }
                description={
                  <div>
                    <p>You can disable your individual notification types once you have fully opted in.</p>
                    <p>
                      Not seeing a text?{' '}
                      <a className="MCP-table-link" href="#">
                        Resend Invite
                      </a>{' '}
                      (Last message sent 09/11/2025 12:43pm IST)
                    </p>
                  </div>
                }
              />
              <div className="MCP-CardContainer">
                <SettingPanelRenderer config={notificationConfig} />
                <SMSConfiguration value={values.linkedContactNumber} onChange={(value) => setFieldValue('linkedContactNumber', value)} />
              </div>
              <div className="controls">
                <Button size="md" variant="secondary" onClick={() => {}}>
                  {translateFn('captions.btnBack')}
                </Button>{' '}
                <Button size="md" onClick={() => {}} variant="primary" type="submit">
                  {translateFn('button.caption.saveAsDraft')}
                </Button>
              </div>
            </div>
          );
        }}
      </Formik>
    </div>
  );
}

export default SettingPanel;
