import * as Yup from 'yup';
import {
  ADDRESS_REGEX,
  ALPHABETIC_WITH_SPACE,
  PHONE_REGEX,
  ZIP_REGEX,
  ALPHA_NUMERIC_ONLY
} from '@src/components/form/ValidationRegExp';
import CommonUtils from '@src/util/CommonUtils';

export const getInitialValues = () => ({
  patient: {
    patientInfo: {
      firstName: '',
      middleName: '',
      lastName: ''
    },
    contact: {
      emailId: '',
      phoneNumber: '',
      homePhone: '',
      workPhone: '',
      preferedMethodOfContact: ''
    },
    patientAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      zipCode: '',
      state: ''
    },
    patientIdentifier: ''
  },
  providerId: ''
});

export const getValidationSchema = (t) => {
  return Yup.object().shape({
    patient: Yup.object().shape({
      patientInfo: Yup.object().shape({
        firstName: CommonUtils.getNameValidation(t, { field: 'first_name' }),
        middleName: CommonUtils.getNameValidation(t, {
          field: 'middle_name'
        }),
        lastName: CommonUtils.getNameValidation(t, { field: 'last_name' })
      }),
      contact: Yup.object().shape({
        emailId: Yup.string()
          .nullable()
          .trim()
          .email(t('orderManagement.patientDetails.validation.invalid_email'))
          .max(50, t('orderManagement.patientDetails.validation.email_max')),
        phoneNumber: Yup.string()
          .nullable()
          .trim()
          .matches(
            PHONE_REGEX,
            t('orderManagement.patientDetails.validation.phone_invalid')
          )
          .max(15, t('orderManagement.patientDetails.validation.phone_max')),
        homePhone: Yup.string().nullable(),
        workPhone: Yup.string().nullable(),
        preferedMethodOfContact: Yup.string().nullable()
      }),
      patientAddress: Yup.object().shape({
        addressLine1: Yup.string()
          .nullable()
          .trim()
          .matches(
            ADDRESS_REGEX,
            t('orgManagement.create_org.validation.address_1_invalid')
          )
          .min(2, t('orgManagement.create_org.validation.address_1_min'))
          .max(100, t('orgManagement.create_org.validation.address_1_max')),
        addressLine2: Yup.string()
          .nullable()
          .trim()
          .matches(
            ADDRESS_REGEX,
            t('orgManagement.create_org.validation.address_2_invalid')
          )
          .min(2, t('orgManagement.create_org.validation.address_2_min'))
          .max(100, t('orgManagement.create_org.validation.address_2_max')),
        city: Yup.string()
          .nullable()
          .trim()
          .matches(
            ALPHABETIC_WITH_SPACE,
            t('orgManagement.create_org.validation.city_invalid')
          )
          .min(2, t('orgManagement.create_org.validation.city_min'))
          .max(15, t('orgManagement.create_org.validation.city_max')),
        zipCode: Yup.string()
          .nullable()
          .trim()
          .matches(
            ZIP_REGEX,
            t('orgManagement.create_org.validation.zip_invalid')
          )
          .max(10, t('orgManagement.create_account.validation.zip_max')),
        state: Yup.string().nullable()
      }),
      patientIdentifier: Yup.string()
        .trim()
        .matches(
          ALPHA_NUMERIC_ONLY,
          t(
            'orderManagement.patientDetails.validation.patient_identifier_must_number'
          )
        )
        .required(
          t(
            'orderManagement.patientDetails.validation.patient_identifier_required'
          )
        )
        .max(
          20,
          t('orderManagement.patientDetails.validation.patient_identifier_max')
        )
    }),
    providerId: Yup.string().nullable()
  });
};

export const getAdditionalContactSchema = (t) => {
  return Yup.object().shape({
    homePhone: Yup.string().matches(PHONE_REGEX, t('validation.phone_no')),
    mobileNumber: Yup.string().matches(PHONE_REGEX, t('validation.phone_no')),
    workPhone: Yup.string().matches(PHONE_REGEX, t('validation.phone_no')),
    preferredMethodOfContact: Yup.string().oneOf(
      ['Mobile', 'Fax'],
      'Preferred method of contact must be either Mobile or Fax'
    ),
    provider: Yup.string().nullable()
  });
};
