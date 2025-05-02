import * as Yup from 'yup';
import {
  PATIENT_RELATIONSHIP,
  PLAN_TYPES
} from '../forms/payer-details.config';

export const getPersonalDetailsTemplate = () => ({
  name: {
    firstName: '',
    middleName: '',
    lastName: ''
  },
  phone: '',
  address: {
    address1: '',
    address2: '',
    zip: '',
    state: '',
    city: ''
  }
});

export const getInsuranceCoverageDetailsTemplate = () => ({
  patientSubscriberRelationship: '',
  policyNumber: '',
  groupNumber: '',
  planType: '',
  effectiveDate: '',
  pcnNumber: '',
  grpNumber: '',
  idNumber: '',
  binNumber: ''
});

export const nameSchema = (t) =>
  Yup.object({
    firstName: Yup.string()
      .nonNullable()
      .required(t('Please enter the First Name.'))
      .max(50, t('First Name should not exceed 50 characters.'))
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
        t('First Name must contain alphabets only.')
      ),
    middleName: Yup.string()
      .nullable()
      .max(50, t('Middle Name should not exceed 50 characters.')),
    lastName: Yup.string()
      .nullable()
      .max(50, t('Last Name should not exceed 50 characters.'))
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
        t('Last Name must contain alphabets only.')
      )
  });

export const phoneSchema = (t) =>
  Yup.string()
    .nullable()
    .matches(/^\d+$/, t('Phone Number must contain digits only.'))
    .max(50, t('Phone Number should not exceed 50 characters.'));

export const addressSchema = (t) =>
  Yup.object({
    address1: Yup.string()
      .nullable()
      .max(100, t('Address Line 1 should not exceed 100 characters.'))
      .matches(/^[^@#%]*$/, t('Address cannot include @, #, or % characters.')),
    address2: Yup.string()
      .nullable()
      .max(100, t('Address Line 2 should not exceed 100 characters.'))
      .matches(/^[^@#%]*$/, t('Address cannot include @, #, or % characters.')),
    zip: Yup.string()
      .nullable()
      .matches(
        /^\d{5}(-\d{4})?$/,
        t('ZIP should be in the format 12345 or 12345-6789.')
      ),
    state: Yup.string()
      .nullable()
      .notOneOf([''], t('Please select a valid State.')),
    city: Yup.string()
      .nullable()
      .max(15, t('City should not exceed 15 characters.'))
      .matches(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/, t('City must contain alphabets only.'))
  });

export const insuranceCompanySchema = (t) =>
  Yup.object({
    name: nameSchema(t),
    phone: phoneSchema(t).nullable(),
    address: addressSchema(t).nullable()
  });

export const insuranceCoverageSchema = (t) =>
  Yup.object({
    patientSubscriberRelationship: Yup.string()
      .required(t('Please select relationship to the subscriber.'))
      .oneOf(
        PATIENT_RELATIONSHIP.map((i) => i.toUpperCase()),
        t('Please select a valid relationship.')
      ),
    policyNumber: Yup.string()
      .required(t('Please enter the Policy Number.'))
      .max(30, t('Policy Number should not exceed 30 characters.'))
      .matches(
        /^[A-Za-z0-9]+$/,
        t('Policy Number should only contain letters and numbers.')
      ),
    groupNumber: Yup.string()
      .nullable()
      .max(30, t('Group Number should not exceed 30 characters.'))
      .matches(
        /^[A-Za-z0-9]*$/,
        t('Group Number should only contain letters and numbers.')
      ),
    planType: Yup.string()
      .nullable()
      .oneOf(PLAN_TYPES, t('Please select a valid Plan Type.')),
    effectiveDate: Yup.date()
      .nullable()
      .required(t('Please enter the Effective Date.'))
      .max(new Date(), t('Effective Date cannot be in the future.')),
    pcnNumber: Yup.string()
      .nullable()
      .max(30, t('PCN Number should not exceed 30 characters.'))
      .matches(/^\d*$/, t('PCN Number must contain numbers only.')),
    grpNumber: Yup.string()
      .nullable()
      .max(30, t('GRP Number should not exceed 30 characters.'))
      .matches(/^\d*$/, t('GRP Number must contain numbers only.')),
    idNumber: Yup.string()
      .nullable()
      .max(30, t('ID Number should not exceed 30 characters.'))
      .matches(/^\d*$/, t('ID Number must contain numbers only.')),
    binNumber: Yup.string()
      .nullable()
      .max(30, t('BIN Number should not exceed 30 characters.'))
      .matches(/^\d*$/, t('BIN Number must contain numbers only.'))
  });

export const fullInsuranceValidationSchema = (t) =>
  Yup.object({
    primaryInsuranceCompany: insuranceCompanySchema(t),
    primaryInsuranceCoverage: insuranceCoverageSchema(t),
    secondaryInsuranceCompany: insuranceCompanySchema(t),
    drugBenefitInsuranceCompany: insuranceCompanySchema(t)
  });
