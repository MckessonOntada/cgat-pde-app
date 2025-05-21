import * as Yup from 'yup';
import { ADDRESS_REGEX, ALPHABETIC_WITH_SPACE, PHONE_REGEX, ZIP_REGEX, ALPHA_NUMERIC_ONLY } from '@src/components/form/ValidationRegExp';
import CommonUtils from '@src/util/CommonUtils';

export const getInitialValues = () => ({
  patient: {
    patientInfo: {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dateOfBirth: ''
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
    patientIdentifier: '',
    patientIdentifier: '',
    mrn: ''
  },
  providerId: ''
});

export const getValidationSchema = (t, isProviderRequired) => {
  return Yup.object().shape({
    patient: Yup.object().shape({
      patientInfo: Yup.object()
        .nullable()
        .shape({
          firstName: CommonUtils.getNameValidation(t, {
            field: 'first_name',
            required: isProviderRequired ? true : false
          }),
          middleName: CommonUtils.getNameValidation(t, {
            field: 'middle_name'
          }),
          lastName: CommonUtils.getNameValidation(t, {
            field: 'last_name',
            required: isProviderRequired ? true : false
          }),
          dateOfBirth: Yup.date()
            .max(new Date(), 'Date of birth can not be greater than today.')
            .when([], {
              is: () => isProviderRequired,
              then: (schema) => schema.required(t('orderManagement.patientDetails.validation.dateOfBirth')),
              otherwise: (schema) => schema.nullable()
            }),
          gender: Yup.string()
            .oneOf(['Male', 'Female', 'Other'], 'Invalid gender selection')
            .when([], {
              is: () => isProviderRequired,
              then: (schema) => schema.required(t('orderManagement.patientDetails.validation.gender')),
              otherwise: (schema) => schema.nullable()
            })
        }),
      ...(isProviderRequired && {
        contact: Yup.object()
          .nullable()
          .shape({
            emailId: Yup.string()
              .nullable()
              .trim()
              .email(t('orderManagement.patientDetails.validation.invalid_email'))
              .max(50, t('orderManagement.patientDetails.validation.email_max')),
            phoneNumber: Yup.string()
              .nullable()
              .trim()
              .matches(PHONE_REGEX, t('orderManagement.patientDetails.validation.phone_invalid'))
              .max(15, t('orderManagement.patientDetails.validation.phone_max'))
              .required(t('orderManagement.patientDetails.validation.phone_no')),
            homePhone: Yup.string().nullable(),
            workPhone: Yup.string().nullable(),
            preferedMethodOfContact: Yup.string().nullable().oneOf(['Mobile', 'Fax'], 'Select valid method of contact.')
          })
      }),
      ...(isProviderRequired && {
        patientAddress: Yup.object()
          .nullable()
          .shape({
            addressLine1: Yup.string()
              .nullable()
              .trim()
              .matches(ADDRESS_REGEX, t('orgManagement.create_org.validation.address_1_invalid'))
              .min(2, t('orgManagement.create_org.validation.address_1_min'))
              .max(100, t('orgManagement.create_org.validation.address_1_max'))
              .required(t('orderManagement.patientDetails.validation.address_1')),
            addressLine2: Yup.string()
              .nullable()
              .trim()
              .matches(ADDRESS_REGEX, t('orgManagement.create_org.validation.address_2_invalid'))
              .min(2, t('orgManagement.create_org.validation.address_2_min'))
              .max(100, t('orgManagement.create_org.validation.address_2_max')),
            city: Yup.string()
              .nullable()
              .trim()
              .matches(ALPHABETIC_WITH_SPACE, t('orgManagement.create_org.validation.city_invalid'))
              .min(2, t('orgManagement.create_org.validation.city_min'))
              .max(15, t('orgManagement.create_org.validation.city_max'))
              .required(t('orderManagement.patientDetails.validation.city')),
            zipCode: Yup.string()
              .nullable()
              .trim()
              .matches(ZIP_REGEX, t('orgManagement.create_org.validation.zip_invalid'))
              .max(10, t('orgManagement.create_account.validation.zip_max'))
              .required(t('orderManagement.patientDetails.validation.zip')),
            state: Yup.string().nullable().required(t('orderManagement.patientDetails.validation.state'))
          })
      }),
      patientIdentifier: Yup.string()
        .trim()
        .matches(ALPHA_NUMERIC_ONLY, t('orderManagement.patientDetails.validation.patient_identifier_must_number'))
        .required(t('orderManagement.patientDetails.validation.patient_identifier_required'))
        .max(20, t('orderManagement.patientDetails.validation.patient_identifier_max')),
      medicalRecordNumber: Yup.string().trim().nullable().matches(ALPHA_NUMERIC_ONLY, t('orderManagement.patientDetails.validation.mrn_must_alphanumeric'))
    }),
    providerId: Yup.string().when([], {
      is: () => isProviderRequired,
      then: (schema) => schema.required('Please select provider.'),
      otherwise: (schema) => schema.notRequired()
    })
  });
};

export const getAdditionalContactSchema = (t) => {
  return Yup.object().shape({
    homePhone: Yup.string().matches(PHONE_REGEX, t('validation.phone_no')),
    mobileNumber: Yup.string().matches(PHONE_REGEX, t('validation.phone_no')),
    workPhone: Yup.string().matches(PHONE_REGEX, t('validation.phone_no')),
    preferredMethodOfContact: Yup.string().oneOf(['Mobile', 'Fax'], 'Preferred method of contact must be either Mobile or Fax'),
    provider: Yup.string().nullable()
  });
};
