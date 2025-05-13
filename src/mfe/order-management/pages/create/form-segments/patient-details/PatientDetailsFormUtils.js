import * as Yup from 'yup';
import {
  ADDRESS_REGEX,
  ALPHABETIC_ONLY,
  ALPHABETIC_WITH_SPACE,
  PHONE_REGEX,
  ZIP_REGEX,
  ALPHABETIC_WITH_SPECIAL_AND_ACCENTED,
  ALPHA_NUMERIC_ONLY
} from '@src/components/form/ValidationRegExp';
import { US_STATES } from '@src/components/form/util';
import CommonUtils from '@src/util/CommonUtils';

const stateOptions = US_STATES();

export const formConfig = [
  {
    sectionTitle: 'orderManagement.patientDetails.patient_details',
    grid: { base: 1, md: 3, lg: 3, xl: 3 },
    fields: [
      {
        id: 'patientInfo.firstName',
        name: 'patientInfo.firstName',
        label: 'orderManagement.patientDetails.inputLabel.first_name',
        placeholder: ' ',
        component: 'input',
        maxLength: 50
      },
      {
        id: 'patientInfo.middleName',
        name: 'patientInfo.middleName',
        label: 'orderManagement.patientDetails.inputLabel.middle_name',
        placeholder: ' ',
        component: 'input',
        maxLength: 50
      },
      {
        id: 'patientInfo.lastName',
        name: 'patientInfo.lastName',
        label: 'orderManagement.patientDetails.inputLabel.last_name',
        placeholder: ' ',
        component: 'input',
        maxLength: 50
      },
      {
        id: 'patientInfo.gender',
        name: 'patientInfo.gender',
        label: 'orderManagement.patientDetails.inputLabel.gender',
        placeholder: ' ',
        component: 'dropdown',
        options: [
          { value: 'Male', label: 'Male' },
          { value: 'Female', label: 'Female' },
          { value: 'Other', label: 'Other' }
        ]
      },
      {
        id: 'patientInfo.dateOfBirth',
        name: 'patientInfo.dateOfBirth',
        label: 'orderManagement.patientDetails.inputLabel.date_of_birth',
        placeholder: ' ',
        component: 'datePicker',
        maxLength: 50,
        disableFuture: true
      },
      {
        id: 'patientIdentifier',
        name: 'patientIdentifier',
        label: 'orderManagement.patientDetails.inputLabel.patientIdentifier',
        placeholder: ' ',
        isRequired: true,
        component: 'input',
        maxLength: 20
      }
    ]
  }
];

export const getValidationSchema = (t) => {
  return Yup.object().shape({
    patientInfo: Yup.object()
      .shape({
        firstName: CommonUtils.getNameValidation(t, { field: 'first_name' }),
        middleName: CommonUtils.getNameValidation(t, { field: 'middle_name' }),
        lastName: CommonUtils.getNameValidation(t, { field: 'last_name' }),
        gender: Yup.string().nullable(),
        dateOfBirth: Yup.date()
          .nullable()
          .max(new Date(new Date().setDate(new Date().getDate() - 1)), t('orderManagement.patientDetails.dob.must.be.past'))
          .typeError(t('orderManagement.patientDetails.validation.invalid_date'))
      })
      .nullable(),
    patientIdentifier: Yup.string()
      .trim()
      .matches(ALPHA_NUMERIC_ONLY, t('orderManagement.patientDetails.validation.patient_identifier_must_number'))
      .required(t('orderManagement.patientDetails.validation.patient_identifier_required'))
      .max(20, t('orderManagement.patientDetails.validation.patient_identifier_max')),
    medicalRecordNumber: Yup.string().trim().matches(ALPHA_NUMERIC_ONLY, t('orderManagement.patientDetails.validation.mrn_must_alphanumeric'))
  });
};
