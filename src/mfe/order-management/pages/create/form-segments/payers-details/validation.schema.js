import * as Yup from 'yup';
import { PATIENT_RELATIONSHIP } from './payer-details.config';
import { ALPHA_NUMERIC, ALPHABETIC_FOR_NAME, NUMBER_REGEX, PHONE_REGEX, RX_SYMBOLS_ALLOWED } from '@src/components/form/ValidationRegExp';
import CommonUtils from '@src/util/CommonUtils';

export const getMedicalInsuranceSchema = (key, t) => ({
  [key]: Yup.object().shape({
    insuranceCompanyName: Yup.string()
      .required(t('message.enterInsuranceCompanyName'))
      .max(100, t('messages.insuranceCompanyNameCharLimit'))
      .test('no-leading-trailing-spaces', t('messages.insuranceCompanyExtraSpaceError'), (value) => value === undefined || value.trim().length === value.length)
      .matches(/^[A-Za-z\s'-]+$/, t('message.avoidSpecialCharsNumbers')),

    memberNumber: Yup.string().required(t('messages.memberNumberRequired')).max(50, t('messages.memberMax')).matches(NUMBER_REGEX, t('messages.onlyNumeric')),
    groupNumber: Yup.string()
      .notRequired()
      .max(50, t('messages.groupMax'))
      .matches(NUMBER_REGEX, { message: t('messages.onlyNumericStrict'), excludeEmptyString: true }),
    insuranceCompanyPhone: Yup.string()
      .required(t('messages.enterPhone'))
      .matches(/^\d{10}$/, t('messages.phoneExact')),
    policyHolderFirstName: Yup.string()
      .required(t('messages.enterFirstName'))
      .max(50, t('messages.firstNameMax'))
      .test('no-leading-trailing-spaces', t('messages.phFirstNameExtraSpaceError'), (value) => value === undefined || value.trim().length === value.length)
      .matches(ALPHABETIC_FOR_NAME, t('messages.onlyAlpha')),
    policyHolderLastName: Yup.string()
      .required(t('messages.enterLastName'))
      .max(50, t('messages.lastNameMax'))
      .test('no-leading-trailing-spaces', t('messages.phLastNameExtraSpaceError'), (value) => value === undefined || value.trim().length === value.length)
      .matches(ALPHABETIC_FOR_NAME, t('messages.onlyAlpha')),
    dateOfBirth: Yup.date().typeError(t('messages.invalidDate')).required(t('messages.enterDOB')).max(CommonUtils.getDOBMaxDate(), t('messages.dobFuture')),
    relationshipToPatient: Yup.string()
      .required(t('messages.selectRelation'))
      .oneOf(
        PATIENT_RELATIONSHIP.map((item) => {
          const value = item.includes('/') ? item.split('/').join('_OR_') : item;
          return value.toUpperCase();
        }),
        t('messages.invalidRelation')
      ),
    relation: Yup.string().when('relationshipToPatient', {
      is: (val) => val === 'OTHER',
      then: (schema) => schema.required(t('labels.enterRelation')),
      otherwise: (schema) => schema.notRequired()
    }),
    medicalCardFront: Yup.mixed().nullable(),
    medicalCardBack: Yup.mixed().nullable()
  })
});

export const getPharmacyInsuranceSchema = (key, t) => ({
  [key]: Yup.object().shape({
    pharmacyBenefitManagerName: Yup.string()
      .required(t('messages.enterPBM'))
      .max(100, t('messages.pbmNameMax'))
      .test('no-leading-trailing-spaces', t('messages.pharmacyManagerExtraSpaceError'), (value) => value === undefined || value.trim().length === value.length)
      .matches(RX_SYMBOLS_ALLOWED, t('messages.alphaSymbols')),
    contact: Yup.string()
      .trim()
      .required(t('message.enterPhone'))
      .matches(PHONE_REGEX, t('message.invalidPhoneNumber'))
      .max(15, t('message.phoneCanNotBeLengthy')),
    rxGroupNumber: Yup.string()
      .required(t('message.enterRxGroupNumber'))
      .max(50, t('messages.rxGroupMax'))
      .matches(NUMBER_REGEX, { message: t('messages.onlyNumericStrict'), excludeEmptyString: true }),
    rxMemberId: Yup.string().max(20, t('messages.rxIdMax')).matches(ALPHA_NUMERIC, t('messages.alphanumericOnly')),
    rxPcn: Yup.string().required(t('messages.enterRxPCN')).max(100, t('messages.rxPcnMax')).matches(ALPHA_NUMERIC, t('messages.alphanumericOnly')),
    rxBin: Yup.string().required(t('messages.enterRxBIN')).max(30, t('messages.rxBinMax')).matches(ALPHA_NUMERIC, t('messages.alphanumericOnly')),
    pharmacyCardFront: Yup.mixed().nullable(),
    pharmacyCardBack: Yup.mixed().nullable()
  })
});

export const getBaseMedicalInsuranceValues = () => ({
  insuranceCompanyName: '',
  memberNumber: '',
  groupNumber: '',
  insuranceCompanyPhone: '',
  policyHolderFirstName: '',
  policyHolderLastName: '',
  dateOfBirth: '',
  relationshipToPatient: '',
  medicalCardFront: null,
  medicalCardBack: null
});

export const getBasePharmacyInsuranceValues = () => ({
  pharmacyBenefitManagerName: '',
  contact: '',
  rxGroupNumber: '',
  rxMemberId: '',
  rxPcn: '',
  rxBin: '',
  pharmacyCardFront: null,
  pharmacyCardBack: null
});

export const baseValues = {
  primaryMedicalInsurance: getBaseMedicalInsuranceValues(),
  primaryPharmacyInsurance: getBasePharmacyInsuranceValues()
};
