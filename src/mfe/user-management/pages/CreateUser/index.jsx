import React from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from 'formik';
import './CreateUser.scss';
import { Button } from '@mckesson/mcp-component-library';
import { Card, Stepper } from '@mckesson/mcp-component-library';
import { useTranslation } from 'react-i18next';
import UserDetailsFormSegment from './CreateUserForm';
import Components from '../../components/form/Components';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

const CreateUser = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

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
  });

  const handleSubmit = values => {
    alert(JSON.stringify(values, null, 2));
    console.log(JSON.stringify(values, null, 2));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="userContainer">
      <div
        className="back-navigation"
        onClick={goBack}
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <MdOutlineKeyboardArrowLeft size="24px" style={{ alignSelf: 'center' }} />
        <p>Back to Previous Page</p>
      </div>
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
                <div>
                  <div className="line-height">
                    <Stepper
                      activeIndex={1}
                      dividerText="of"
                      stepHeaders={[
                        {
                          label: 'User Details',
                        },
                        {
                          label: 'Roles and Permissions',
                        },
                        {
                          label: 'Associate Accounts',
                        },
                      ]}
                    />
                  </div>
                  <div className="headingBox">
                    <p className="font-bold-title-m"> {t('details_to_create_user')}</p>
                  </div>
                  <UserDetailsFormSegment />
                </div>
              }
            />
            <div className={'buttonGroup'}>
              <Button variant="secondary" type="button" onClick={handleGoBack}>
                {t('back')}
              </Button>
              <Button type="submit">{t('next')}</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateUser;
export { UserDetailsFormSegment };
