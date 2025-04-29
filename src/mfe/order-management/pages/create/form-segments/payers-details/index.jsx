import React from 'react';
import FormRenderer from '@src/mfe/core-config/manage-providers/forms/FormRenderer';
import { sections } from './forms/payer-details.config';
import { Form, Formik } from 'formik';

const PayerDetails = () => {
  return (
    <Formik
      initialValues={{}}
      //   validationSchema={getValidationSchema(t)}
      enableReinitialize
      onSubmit={(values, actions) => {}}>
      <Form>
        <FormRenderer sections={sections} />
      </Form>
    </Formik>
  );
};

export default PayerDetails;
