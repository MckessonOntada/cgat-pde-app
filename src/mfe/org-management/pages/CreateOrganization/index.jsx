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
    org_name: '',
    file: '',
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

const ALPHA_NUMERIC_WITH_SPECIAL = /^[a-zA-Z0-9-_ ]*$/;
const ALPHABETIC_ONLY = /^[a-zA-Z]+$/;
const ADDRESS_REGEX = /^[a-zA-Z0-9\s,.'-]*$/;
const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
const PHONE_REGEX = /^[0-9]{10}$/;
const FAX_REGEX = /[\+? *[1-9]+]?[0-9 ]+/;

const validationSchema = Yup.object({
  org_name: Yup.string()
    .required(t('orgManagement.create_org.validation.org_name_required'))
    .matches(ALPHA_NUMERIC_WITH_SPECIAL, t('orgManagement.create_org.validation.org_name_invalid'))
    .max(100, t('orgManagement.create_org.validation.org_name_max')),

  first_name: Yup.string()
    .required(t('orgManagement.create_org.validation.first_name_required'))
    .matches(ALPHABETIC_ONLY, t('orgManagement.create_org.validation.contact_person_first_name_invalid'))
    .max(50, t('orgManagement.create_org.validation.first_name_max')),

  middle_name: Yup.string()
    .matches(ALPHABETIC_ONLY, t('orgManagement.create_org.validation.middle_name_invalid'))
    .max(50, t('orgManagement.create_org.validation.middle_name_max')),

  last_name: Yup.string()
    .required(t('orgManagement.create_org.validation.last_name_required'))
    .matches(ALPHABETIC_ONLY, t('orgManagement.create_org.validation.contact_person_last_name_invalid'))
    .max(50, t('orgManagement.create_org.validation.last_name_max')),

  address_1: Yup.string()
    .required(t('orgManagement.create_org.validation.address_1_required'))
    .matches(ADDRESS_REGEX, t('orgManagement.create_org.validation.address_1_invalid'))
    .max(100, t('orgManagement.create_org.validation.address_1_max')),

  address_2: Yup.string()
    .matches(ADDRESS_REGEX, t('orgManagement.create_org.validation.address_2_invalid'))
    .max(250, t('orgManagement.create_org.validation.address_2_max')),

  city: Yup.string()
    .required(t('orgManagement.create_org.validation.city_required'))
    .matches(ALPHABETIC_ONLY, t('orgManagement.create_org.validation.city_invalid'))
    .max(100, t('orgManagement.create_org.validation.city_max')),

  zip: Yup.string()
    .required(t('orgManagement.create_org.validation.zip_required'))
    .matches(ZIP_REGEX, t('orgManagement.create_org.validation.zip_invalid')),

  state: Yup.string()
    .required(t('orgManagement.create_org.validation.state_required'))
    .matches(ALPHABETIC_ONLY, t('orgManagement.create_org.validation.state_invalid'))
    .max(100, t('orgManagement.create_org.validation.state_max')),

  email: Yup.string()
    .email(t('orgManagement.create_org.validation.invalid_email'))
    .required(t('orgManagement.create_org.validation.email_required'))
    .max(100, t('orgManagement.create_org.validation.email_max')),

  phoneInput: Yup.string()
    .matches(PHONE_REGEX, t('orgManagement.create_org.validation.phone_no_invalid'))
    .required(t('orgManagement.create_org.validation.phone_no_required')),

  fax: Yup.string()
    .required(t('orgManagement.create_org.validation.fax_required'))
    .matches(FAX_REGEX, t('orgManagement.create_org.validation.fax_invalid'))
    .max(15, t('orgManagement.create_org.validation.fax_max'))
});


  // const validationSchema = Yup.object({
  //   org_name: Yup.string()
  //     .required(t('orgManagement.create_org.validation.org_name_required'))
  //     .matches(/^[a-zA-Z0-9-_ ]*$/, t('orgManagement.create_org.validation.org_name_invalid')) // Only allows letters, numbers, spaces, hyphen, and underscore
  //     .max(100, t('orgManagement.create_org.validation.org_name_max')), // Max 100 characters
  
  //   first_name: Yup.string()
  //     .required(t('orgManagement.create_org.validation.contact_person_first_name_required'))
  //     .matches(/^[a-zA-Z]+$/, t('orgManagement.create_org.validation.contact_person_first_name_invalid')) // Only alphabetic characters
  //     .max(50, t('orgManagement.create_org.validation.first_name_max')), // Max 50 characters
  
  //   middle_name: Yup.string()
  //     .matches(/^[a-zA-Z]+$/, t('orgManagement.create_org.validation.middle_name_invalid')) // Only alphabetic characters
  //     .max(50, t('orgManagement.create_org.validation.middle_name_max')),
  
  //   last_name: Yup.string()
  //     .required(t('orgManagement.create_org.validation.last_name_required'))
  //     .matches(/^[a-zA-Z]+$/, t('orgManagement.create_org.validation.contact_person_last_name_invalid')) // Only alphabetic characters
  //     .max(50, t('orgManagement.create_org.validation.last_name_max')),
  
  //   address_1: Yup.string()
  //     .required(t('orgManagement.create_org.validation.address_1_required'))
  //     .matches(/^[a-zA-Z0-9\s,.'-]*$/, t('orgManagement.create_org.validation.address_1_invalid')) // Allows letters, numbers, spaces, commas, periods, hyphens, and apostrophes
  //     .max(100, t('orgManagement.create_org.validation.address_1_max')), // Max 100 characters
  
  //   address_2: Yup.string()
  //     .matches(/^[a-zA-Z0-9\s,.'-]*$/, t('orgManagement.create_org.validation.address_2_invalid'))
  //     .max(250, t('orgManagement.create_org.validation.address_2_max')), // Max 250 characters
  
  //   city: Yup.string()
  //     .required(t('orgManagement.create_org.validation.city_required'))
  //     .matches(/^[a-zA-Z\s]+$/, t('orgManagement.create_org.validation.city_invalid')) // Allows alphabetic characters and spaces
  //     .max(100, t('orgManagement.create_org.validation.city_max')),
  
  //   zip: Yup.string()
  //     .required(t('orgManagement.create_org.validation.zip_required'))
  //     .matches(/^\d{5}(-\d{4})?$/, t('orgManagement.create_org.validation.zip_invalid')), // US ZIP code format
  
  //   state: Yup.string()
  //     .required(t('orgManagement.create_org.validation.state_required'))
  //     .matches(/^[a-zA-Z\s]+$/, t('orgManagement.create_org.validation.state_invalid')) // Allows letters and spaces
  //     .max(100, t('orgManagement.create_org.validation.state_max')),
  
  //   email: Yup.string()
  //     .email(t('orgManagement.create_org.validation.invalid_email'))
  //     .required(t('orgManagement.create_org.validation.email_required'))
  //     .max(100, t('orgManagement.create_org.validation.email_max')), // Max 100 characters
  
  //   phoneInput: Yup.string()
  //     .matches(/^[0-9]{10}$/, t('orgManagement.create_org.validation.phone_no_invalid')) // Only 10 digits
  //     .required(t('orgManagement.create_org.validation.phone_no_required')),
  
  //   fax: Yup.string()
  //     .required(t('orgManagement.create_org.validation.fax_required'))
  //     .matches(/[\+? *[1-9]+]?[0-9 ]+/, t('orgManagement.create_org.validation.fax_invalid'))
  //     .max(15, t('orgManagement.create_org.validation.fax_max')) // Max 15 characters
  // });
  

  const handleSubmit = (values) => {
    console.log(values);
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
