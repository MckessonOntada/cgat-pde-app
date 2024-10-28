import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import './assets/style.scss';
import { Card, Button } from '@mckesson/mcp-component-library';
import { useTranslation } from 'react-i18next';
import { UserDetailsFormSegment } from '@mfe/user-management/src/pages/CreateUser';
import Components from '@mfe/user-management/src/components/form/Components';
// import UserDetailsFormSegment from "./CreateUserForm";

const SignUp = () => {
  const { t } = useTranslation();

  const initialValues = {
    first_name: '',
    middle_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    zip: '',
    state: '',
    email: '',
    phoneInput: '',
    fax: '',
    organization: '',
    comment: '',
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required(t('first_name_required')),
    middle_name: Yup.string().required(t('middle_name_required')),
    last_name: Yup.string().required(t('last_name_required')),
    address_1: Yup.string().required(t('address_1_required')),
    address_2: Yup.string(),
    city: Yup.string().required(t('city_required')),
    zip: Yup.string().required(t('zip_required')),
    state: Yup.string().required(t('state_required')),
    email: Yup.string().email(t('invalid_email')).required(t('email_required')),
    phoneInput: Yup.string()
      .matches(/^[0-9]{10}$/, t('phone_no_required'))
      .required(t('phone_no_required')),
    fax: Yup.string().required(t('fax_required')),
    // organization: Yup.string().required(t("organization_required")),
    comment: Yup.string().required(t('comment_required')),
  });

  const handleSubmit = values => {
    alert(JSON.stringify(values, null, 2));
    console.log(JSON.stringify(values, null, 2));
  };

  return (
    <div className="userContainer">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          handleSubmit(values);
          actions.setSubmitting(false);
        }}
      >
        {() => (
          <Form>
            <Card
              bodyContent={
                <div className="form-container">
                  <div className="form-heading">
                    <p className="font-bold-title-m"> {t('forms.headings.newUserRegistration')}</p>
                  </div>
                  <UserDetailsFormSegment />
                  <div className="form-segment">
                    <div className="headingBox">
                      <p className="form-segment-title">{t('forms.headings.organization_details')}</p>
                    </div>
                    <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 line-height">
                      <Field
                        name="organization"
                        label={t('forms.labels.organization')}
                        placeholder=" "
                        component={Components['dropdown']}
                        // isRequired
                        options={[]}
                      />
                    </div>
                    <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                      <Field
                        name="comment"
                        label={t('forms.labels.comment')}
                        placeholder=" "
                        component={Components['textarea']}
                        isRequired
                        maxCharHelperText={t('forms.placeholder.max_5000_chars')}
                        maxCharLimit={5000}
                      />
                    </div>
                  </div>
                </div>
              }
            />
            <div className={'buttonGroup'}>
              <Button variant="secondary" type="button" onClick={() => console.log('go back')}>
                {t('button.cancel')}
              </Button>
              <Button type="submit">{t('next')}</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
