import React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import './CreateOrg.scss';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import OrgDetailsFormSegment from './CreateOrgForm';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

const CreateOrganization = () => {
  const { t } = useTranslate();
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
    fax: ''
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required(
      t('orgManagement.create_org.validation.first_name_required')
    ),
    middle_name: Yup.string(),
    last_name: Yup.string().required(t('orgManagement.create_org.validation.last_name_required')),
    address_1: Yup.string().required(t('orgManagement.create_org.validation.address_1_required')),
    address_2: Yup.string(),
    city: Yup.string().required(t('orgManagement.create_org.validation.city_required')),
    zip: Yup.string().required(t('orgManagement.create_org.validation.zip_required')),
    state: Yup.string().required(t('orgManagement.create_org.validation.state_required')),
    email: Yup.string()
      .email(t('orgManagement.create_org.validation.invalid_email'))
      .required(t('orgManagement.create_org.validation.email_required')),
    phoneInput: Yup.string()
      .matches(/^[0-9]{10}$/, t('orgManagement.create_org.validation.phone_no_required'))
      .required(t('orgManagement.create_org.validation.phone_no_required')),
    fax: Yup.string().required(t('orgManagement.create_org.validation.fax_required'))
  });

  const handleSubmit = (values) => {
    alert(JSON.stringify(values, null, 2));
    console.log(JSON.stringify(values, null, 2));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="main-container">
      <div className="back-navigation py2 capitalize" onClick={goBack}>
        <MdOutlineKeyboardArrowLeft size="24px" />
        <p>Back to Manage Users</p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          handleSubmit(values);
          actions.setSubmitting(false);
        }}
        validateOnChange={false}
        validateOnBlur={true}>
        {() => (
          <Form>
            <div className="container-box">
              <div className="headingBox">
                <p className="font-bold-title-s">
                  {t('Please complete the form to create a new organization')}
                </p>
              </div>
              <OrgDetailsFormSegment />
            </div>

            <div className={'buttonGroup'}>
              <Button variant="secondary" type="button" onClick={handleGoBack} size={'md'}>
                {t('orgManagement.button.back')}
              </Button>
              <Button type="submit" size={'md'}>
                {t('orgManagement.button.next')}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CreateOrganization;
export { OrgDetailsFormSegment };
