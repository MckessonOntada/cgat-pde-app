import * as Yup from 'yup';
import { ALPHA_NUMERIC_ONLY } from '@src/components/form/ValidationRegExp';
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
          firstName: CommonUtils.getNameValidation(t, { field: 'first_name' }),
          middleName: CommonUtils.getNameValidation(t, {
            field: 'middle_name'
          }),
          lastName: CommonUtils.getNameValidation(t, { field: 'last_name' }),
          dateOfBirth: Yup.date()
            .nullable()
            .max(new Date(), 'Date of birth can not be greater than today.'),
          gender: Yup.string()
            .nullable()
            .oneOf(['Male', 'Female', 'Other'], 'Invalid gender selection')
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
        ),
      medicalRecordNumber: Yup.string()
        .trim()
        .matches(
          ALPHA_NUMERIC_ONLY,
          t('orderManagement.patientDetails.validation.mrn_must_alphanumeric')
        )
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
    provider: Yup.string().nullable()
  });
};
