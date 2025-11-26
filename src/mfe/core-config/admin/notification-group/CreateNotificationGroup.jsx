import DynamicRuleGroup from '@src/components/rule-group';
import config from './config.js';
import React from 'react';
import { Formik, Form } from 'formik';
import { NotificationGroupSchema } from './validation.schema.js';

function CreateNotificationGroup() {
  const handleOnSubmit = (...args) => {
    console.log(args);
  };
  return (
    <React.Fragment>
      <Formik
        onSubmit={handleOnSubmit}
        validationSchema={NotificationGroupSchema}
        initialValues={{
          groupName: '',
          participants: [],
          rules: []
        }}
        enableReinitialize>
        <Form>
          <DynamicRuleGroup config={config} />
        </Form>
      </Formik>
    </React.Fragment>
  );
}

export default CreateNotificationGroup;
