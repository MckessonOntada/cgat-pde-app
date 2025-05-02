import {
  PATIENT_RELATIONSHIP,
  PLAN_TYPES
} from './../forms/payer-details.config';
import * as Yup from 'yup';

export const INITIAL_VALIDATION_SCHEMA = (t) =>
  Yup.object().shape({
    'first-name': Yup.string()
      .required(t('Please enter the First Name.'))
      .max(50, t('First Name should not exceed 50 characters.'))
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
        t(
          'First Name should contain alphabets only and cannot include special characters or numbers.'
        )
      ),
    'last-name': Yup.string()
      .max(50, t('Last Name should not exceed 50 characters.'))
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
        t(
          'Last Name should contain alphabets only and cannot include special characters or numbers.'
        )
      ),
    'phone-number': Yup.string()
      .max(50, t('Phone Number should not exceed 50 characters.'))
      .matches(/^\d*$/, t('Phone Number must contain valid digits only.')),
    'address-line-1': Yup.string()
      .max(100, t('Address 1 should not exceed 100 characters.'))
      .matches(
        /^[^@#%]*$/,
        t('Address 1 cannot contain special characters like @, #, %, etc.')
      ),
    'address-line-2': Yup.string()
      .max(100, t('Address 2 should not exceed 100 characters.'))
      .matches(
        /^[^@#%]*$/,
        t('Address 2 cannot contain special characters like @, #, %, etc.')
      ),
    zip: Yup.string().matches(
      /^\d{5}(-\d{4})?$/,
      t('Zip Code should follow US format: 12345 or 12345-6789.')
    ),
    city: Yup.string()
      .max(15, t('City should not exceed 15 characters.'))
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
        t(
          'City should contain alphabets only and cannot include numbers or special characters.'
        )
      ),
    state: Yup.string()
      .nullable()
      .notOneOf([''], t('Please select a valid State')),
    'patient-relationship': Yup.string()
      .required(
        t("Please select the patient's relationship to the subscriber.")
      )
      .notOneOf([''], t('Please select relationship to the subscriber.'))
      .oneOf(PATIENT_RELATIONSHIP, t('Please select a valid relationship.')),
    'policy-number': Yup.string()
      .required(t('Please enter the Policy Number.'))
      .max(30, t('Policy Number should not exceed 30 characters.'))
      .matches(
        /^[A-Za-z0-9]+$/,
        t('Policy Number should only contain letters and numbers.')
      ),
    'group-number': Yup.string()
      .max(30, t('Group Number should not exceed 30 characters.'))
      .matches(
        /^[A-Za-z0-9]*$/,
        t('Group Number should only contain letters and numbers.')
      ),
    'plan-type': Yup.string()
      .nullable()
      .notOneOf([''], t('Please select a valid Plan Type'))
      .oneOf(PLAN_TYPES, t('Please select a valid Plan Type')),
    'effective-date': Yup.date()
      .required(t('Please enter the Effective Date.'))
      .max(new Date(), t('Effective Date cannot be in the future.'))
      .typeError(t('Please select a valid date.')),
    'rx-pcn-number': Yup.string()
      .max(30, t('Rx PCN Number should not exceed 30 digits.'))
      .matches(/^\d*$/, t('Rx PCN Number must contain numbers only.')),
    'rx-grp-number': Yup.string()
      .max(30, t('Rx GRP Number should not exceed 30 digits.'))
      .matches(/^\d*$/, t('Rx GRP Number must contain numbers only.')),
    'rx-id-number': Yup.string()
      .max(30, t('Rx ID Number should not exceed 30 digits.'))
      .matches(/^\d*$/, t('Rx ID Number must contain numbers only.')),
    'rx-bin-number': Yup.string()
      .max(30, t('Rx BIN Number should not exceed 30 digits.'))
      .matches(/^\d*$/, t('Rx BIN Number must contain numbers only.'))
  });

export const SECONDARY_PAYER_VALIDATION_SCHEMA = (t) =>
  Yup.object().shape({
    'secondary-payer-first-name': Yup.string()
      .required(t('payer.form.secondaryPayerFirstNameRequired'))
      .max(50, t('payer.form.secondaryPayerFirstNameMaxCharacters'))
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
        t('payer.form.secondaryPayerFirstNameAlphaOnly')
      ),

    'secondary-payer-last-name': Yup.string()
      .max(50, t('payer.form.secondaryPayerLastNameMaxCharacters'))
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
        t('payer.form.secondaryPayerLastNameAlphaOnly')
      ),

    'secondary-payer-phone-number': Yup.string()
      .max(50, t('payer.form.secondaryPayerPhoneNumberMaxCharacters'))
      .matches(/^\d*$/, t('payer.form.secondaryPayerPhoneNumberDigitsOnly')),

    'secondary-payer-address-line-1': Yup.string()
      .max(100, t('payer.form.secondaryPayerAddressLine1MaxCharacters'))
      .matches(
        /^[^@#%]*$/,
        t('payer.form.secondaryPayerAddressLine1NoSpecialChars')
      ),

    'secondary-payer-address-line-2': Yup.string()
      .max(100, t('payer.form.secondaryPayerAddressLine2MaxCharacters'))
      .matches(
        /^[^@#%]*$/,
        t('payer.form.secondaryPayerAddressLine2NoSpecialChars')
      ),

    'secondary-payer-zip': Yup.string().matches(
      /^\d{5}(-\d{4})?$/,
      t('payer.form.secondaryPayerZipCodeFormat')
    ),

    'secondary-payer-city': Yup.string()
      .max(15, t('payer.form.secondaryPayerCityMaxCharacters'))
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
        t('payer.form.secondaryPayerCityAlphaOnly')
      ),

    'secondary-payer-state': Yup.string()
      .nullable()
      .notOneOf([''], t('payer.form.secondaryPayerStateRequired'))
  });

export const INSURANCE_COMPANY_VALIDATION_SCHEMA = (t) =>
  Yup.object().shape({
    'insurance-company-first-name': Yup.string()
      .required(t('payer.form.insuranceCompanyFirstNameRequired'))
      .max(50, t('payer.form.insuranceCompanyFirstNameMaxCharacters'))
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/,
        t('payer.form.insuranceCompanyFirstNameContains')
      ),
    'insurance-company-last-name': Yup.string()
      .max(50, t('payer.form.insuranceCompanyLastNameMaxCharacters'))
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
        t('payer.form.insuranceCompanyLastNameContains')
      ),
    'insurance-company-phone-number': Yup.string()
      .max(50, 'payer.form.insuranceCompanyPhoneNumberMaxCharacters')
      .matches(/^\d*$/, 'payer.form.insuranceCompanyPhoneNumberDigitsOnly'),
    'insurance-company-address-line-1': Yup.string()
      .max(100, 'payer.form.insuranceCompanyAddressLine1MaxCharacters')
      .matches(
        /^[^@#%]*$/,
        'payer.form.insuranceCompanyAddressLine1NoSpecialChars'
      ),
    'insurance-company-address-line-2': Yup.string()
      .max(100, 'payer.form.insuranceCompanyAddressLine2MaxCharacters')
      .matches(
        /^[^@#%]*$/,
        'payer.form.insuranceCompanyAddressLine2NoSpecialChars'
      ),
    'insurance-company-zip': Yup.string().matches(
      /^\d{5}(-\d{4})?$/,
      'payer.form.insuranceCompanyZipCodeFormat'
    ),
    'insurance-company-city': Yup.string()
      .max(15, 'payer.form.insuranceCompanyCityMaxCharacters')
      .matches(
        /^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/,
        'payer.form.insuranceCompanyCityAlphaOnly'
      ),
    'insurance-company-state': Yup.string()
      .nullable()
      .notOneOf([''], 'payer.form.insuranceCompanyStateRequired')
  });
