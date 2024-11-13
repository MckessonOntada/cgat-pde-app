import React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import './CreateOrg.scss';
import { Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import OrgDetailsFormSegment from './CreateOrgForm';
import { useNavigate } from 'react-router-dom';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import {
  ALPHA_NUMERIC_WITH_SPECIAL,
  ALPHABETIC_ONLY,
  ADDRESS_REGEX,
  ZIP_REGEX,
  PHONE_REGEX,
  FAX_REGEX
} from '../../../../components/form/ValidationRegExp';

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

  const validationSchema = Yup.object({
    org_name: Yup.string()
      .required(t('orgManagement.create_org.validation.org_name_required'))
      .matches(
        ALPHA_NUMERIC_WITH_SPECIAL,
        t('orgManagement.create_org.validation.org_name_invalid')
      )
      .max(100, t('orgManagement.create_org.validation.org_name_max')),

    first_name: Yup.string()
      .required(t('orgManagement.create_org.validation.first_name_required'))
      .matches(
        ALPHABETIC_ONLY,
        t('orgManagement.create_org.validation.contact_person_first_name_invalid')
      )
      .max(50, t('orgManagement.create_org.validation.first_name_max')),

    middle_name: Yup.string()
      .matches(ALPHABETIC_ONLY, t('orgManagement.create_org.validation.middle_name_invalid'))
      .max(50, t('orgManagement.create_org.validation.middle_name_max')),

    last_name: Yup.string()
      .required(t('orgManagement.create_org.validation.last_name_required'))
      .matches(
        ALPHABETIC_ONLY,
        t('orgManagement.create_org.validation.contact_person_last_name_invalid')
      )
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
      .matches(FAX_REGEX, t('orgManagement.create_org.validation.fax_invalid'))
      .max(15, t('orgManagement.create_org.validation.fax_max')),

  });

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
