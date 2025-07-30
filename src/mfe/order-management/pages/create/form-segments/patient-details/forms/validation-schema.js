import * as Yup from 'yup';
import { ADDRESS_REGEX, ALPHABETIC_WITH_SPACE, PHONE_REGEX, ZIP_REGEX, ALPHA_NUMERIC_ONLY } from '@src/components/form/ValidationRegExp';
import CommonUtils from '@src/util/CommonUtils';
import { channel } from 'process';

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
    // medicalRecordNumber: '',
    coiId: ''
  },
  providerId: ''
});

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const getValidationSchema = (t, isSpOrder, spMaterialConfig, therapyConfig) => {
  return Yup.object().shape({
    patient: Yup.object().shape({
      patientInfo: Yup.object()
        .nullable()
        .shape({
          firstName: CommonUtils.getNameValidation(t, {
            field: 'first_name',
            required: isSpOrder ? true : false
          }),
          middleName: CommonUtils.getNameValidation(t, {
            field: 'middle_name'
          }),
          lastName: CommonUtils.getNameValidation(t, {
            field: 'last_name',
            required: isSpOrder ? true : false
          }),
          dateOfBirth: Yup.date()
            .max(yesterday, t('labels.invalidDateOfBirth'))
            .typeError(t('labels.selectValidDate'))
            .when([], {
              is: () => isSpOrder,
              then: (schema) => schema.required(t('orderManagement.patientDetails.validation.dateOfBirth')),
              otherwise: (schema) => schema.nullable()
            }),
          gender: Yup.string()
            .oneOf(['Male', 'Female', 'Other'], t('labels.invalidGenderSelection'))
            .when([], {
              is: () => isSpOrder,
              then: (schema) => schema.required(t('orderManagement.patientDetails.validation.gender')),
              otherwise: (schema) => schema.nullable()
            })
        }),
      ...(isSpOrder && {
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
      ...(isSpOrder && {
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
        .matches(ALPHA_NUMERIC_ONLY, t('orderManagement.patientDetails.validation.patient_identifier_must_number'))
        .max(20, t('orderManagement.patientDetails.validation.patient_identifier_max'))
        .when([], {
          is: () => !isSpOrder && therapyConfig.isPIDRequired,
          then: (schema) =>
            schema
              .required(t('orderManagement.patientDetails.validation.patient_identifier_required'))
              .test(
                'no-leading-trailing-spaces',
                t('orderManagement.patientDetails.validation.patient_identifier_must_number'),
                (value) => value === undefined || value.trim().length === value.length
              ),
          otherwise: (schema) => schema.notRequired()
        }),

      coiId: Yup.string()
        .matches(ALPHA_NUMERIC_ONLY, t('labels.COI_IdMustValidNumber'))
        .max(10, t('labels.COI_IdExceedDigits'))
        .when([], {
          is: () => isSpOrder && spMaterialConfig?.isCoiIdRequired,
          then: (schema) => schema.required(t('labels.COIIdRequired')),
          otherwise: (schema) => schema.notRequired()
        })
    }),
    providerId: Yup.string().when([], {
      is: () => isSpOrder,
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
