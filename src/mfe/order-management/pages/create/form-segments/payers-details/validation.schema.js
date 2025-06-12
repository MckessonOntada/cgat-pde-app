import * as Yup from 'yup';
import { PATIENT_RELATIONSHIP } from './payer-details.config';

const ALPHABETIC_ONLY = /^[A-Za-z\s'-]+$/;
const NUMERIC_ONLY = /^\d+$/;
const ALPHANUMERIC_ONLY = /^[A-Za-z0-9]+$/;
const RX_SYMBOLS_ALLOWED = /^[A-Za-z&\s-]+$/;

export const getMedicalInsuranceSchema = (key, t) => ({
  [key]: Yup.object().shape({
    insuranceCompanyName: Yup.string()
      .required(t('messages.enterInsuranceCompanyName'))
      .max(100, t('messages.insuranceCompanyNameCharLimit'))
      .matches(/^[A-Za-z\s'-]+$/, t('messages.avoidSpecialCharsNumbers')),

    memberNumber: Yup.string().required('messages.memberNumberRequired').max(50, t('messages.memberMax')).matches(NUMERIC_ONLY, t('messages.onlyNumeric')),
    groupNumber: Yup.string()
      .notRequired()
      .max(50, t('messages.groupMax'))
      .matches(NUMERIC_ONLY, { message: t('messages.onlyNumericStrict'), excludeEmptyString: true }),
    insuranceCompanyPhone: Yup.string()
      .required(t('messages.enterPhone'))
      .matches(/^\d{10}$/, t('messages.phoneExact')),
    policyHolderFirstName: Yup.string()
      .required(t('messages.enterFirstName'))
      .max(50, t('messages.firstNameMax'))
      .matches(ALPHABETIC_ONLY, t('messages.onlyAlpha')),
    policyHolderLastName: Yup.string()
      .required(t('messages.enterLastName'))
      .max(50, t('messages.lastNameMax'))
      .matches(ALPHABETIC_ONLY, t('messages.onlyAlpha')),
    dateOfBirth: Yup.date().typeError(t('messages.invalidDate')).required(t('messages.enterDOB')).max(new Date(), t('messages.dobFuture')),
    relationshipToPatient: Yup.string().required(t('messages.selectRelation')).oneOf(PATIENT_RELATIONSHIP, t('messages.invalidRelation')),
    medicalCardFront: Yup.mixed().nullable(),
    medicalCardBack: Yup.mixed().nullable()
  })
});

export const getPharmacyInsuranceSchema = (key, t) => ({
  [key]: Yup.object().shape({
    pharmacyBenefitManagerName: Yup.string()
      .required(t('messages.enterPBM'))
      .max(100, t('messages.pbmNameMax'))
      .matches(RX_SYMBOLS_ALLOWED, t('messages.alphaSymbols')),
    rxGroupNumber: Yup.string()
      .notRequired()
      .max(50, t('messages.rxGroupMax'))
      .matches(NUMERIC_ONLY, { message: t('messages.onlyNumericStrict'), excludeEmptyString: true }),
    rxMemberId: Yup.string().required(t('messages.enterRxID')).max(20, t('messages.rxIdMax')).matches(ALPHANUMERIC_ONLY, t('messages.alphanumericOnly')),
    rxPcn: Yup.string().required(t('messages.enterRxPCN')).max(100, t('messages.rxPcnMax')).matches(ALPHANUMERIC_ONLY, t('messages.alphanumericOnly')),
    rxBin: Yup.string().required(t('messages.enterRxBIN')).max(30, t('messages.rxBinMax')).matches(ALPHANUMERIC_ONLY, t('messages.alphanumericOnly')),
    pharmacyCardFront: Yup.mixed().nullable(),
    pharmacyCardBack: Yup.mixed().nullable()
  })
});

export const getBaseMedicalInsuranceValues = () => ({
  insuranceCompanyName: '',
  memberNumber: '',
  groupNumber: '',
  phoneNumber: '',
  policyHolderFirstName: '',
  policyHolderLastName: '',
  dateOfBirth: '',
  relationshipToPatient: '',
  medicalCardFront: null,
  medicalCardBack: null
});

export const getBasePharmacyInsuranceValues = () => ({
  pharmacyBenefitManagerName: '',
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
