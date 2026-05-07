import { ZIP_REGEX } from '@src/components/form/ValidationRegExp';
import * as yup from 'yup';

const nameRegex = /^[A-Za-z\s.-]+$/;
const middleNameRegex = /^[A-Za-z\s.]+$/;
const lastNameRegex = /^[A-Za-z\s]+$/;
const deaRegex = /^[A-Za-z][A-Za-z0-9][0-9]{7}$/;
const npiRegex = /^\d{10}$/;
const tinRegex = /^\d{9}$/;
const faxRegex = /^\d{1,20}$/;
const medicaidNumberRegex = /^\d{6}$/;
const addressRegex = /^[A-Za-z0-9\s,./-]+$/;
const cityRegex = /^[A-Za-z\s]+$/;
const zipRegex = /^\d{5}(-\d{4})?$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;

export const getProviderSchema = (t) =>
  yup.object().shape({
    firstName: yup
      .string()
      .required(t('provider.firstName.required'))
      .min(2, t('provider.firstName.min'))
      .max(50, t('provider.firstName.max'))
      .matches(nameRegex, t('provider.firstName.invalid'))
      .test('trim-check', t('provider.firstName.trim'), (val) => val === val?.trim()),

    middleName: yup
      .string()
      .max(50, t('provider.middleName.max'))
      .matches(middleNameRegex, t('provider.middleName.invalid'))
      .test('trim-check', t('provider.middleName.trim'), (val) => !val || val === val.trim()),

    lastName: yup
      .string()
      .required(t('provider.lastName.required'))
      .min(2, t('provider.lastName.min'))
      .max(50, t('provider.lastName.max'))
      .matches(lastNameRegex, t('provider.lastName.invalid'))
      .test('trim-check', t('provider.lastName.trim'), (val) => val === val?.trim()),

    deaNumber: yup
      .string()
      .nullable()
      .max(9, t('provider.dea.max'))
      .matches(/^[A-Za-z0-9]+$/, t('provider.dea.alphaNum'))
      .matches(deaRegex, t('provider.dea.format'))
      .test('no-spaces-or-hyphens', t('provider.dea.noSpaces'), (val) => !val || (!val.includes(' ') && !val.includes('-'))),

    npiNumber: yup.string().required(t('provider.npi.required')).length(10, t('provider.npi.length')).matches(npiRegex, t('provider.npi.numeric')),
    tinNumber: yup.string().required(t('provider.tin.required')).length(9, t('provider.tin.length')).matches(tinRegex, t('provider.tin.numeric')),

    medicaidNumber: yup.string().length(6, t('provider.medicaid.length')).matches(medicaidNumberRegex, t('provider.medicaid.numeric')),
    address1: yup
      .string()
      .required(t('provider.address1.required'))
      .max(100, t('provider.address1.max'))
      .matches(addressRegex, t('provider.address1.invalid'))
      .test('trim-check', t('provider.address1.trim'), (val) => val === val?.trim()),

    address2: yup
      .string()
      .max(100, t('provider.address2.max'))
      .matches(addressRegex, t('provider.address2.invalid'))
      .test('trim-check', t('provider.address2.trim'), (val) => !val || val === val.trim()),

    city: yup
      .string()
      .required(t('provider.city.required'))
      .max(50, t('provider.city.max'))
      .matches(cityRegex, t('provider.city.invalid'))
      .test('trim-check', t('provider.city.trim'), (val) => val === val?.trim()),

    zip: yup
      .string()
      .required(t('provider.zip.required'))
      .matches(ZIP_REGEX, t('provider.zip.format'))
      .test('no-spaces', t('provider.zip.noSpaces'), (val) => !val.includes(' ')),

    state: yup
      .string()
      .required(t('provider.state.required'))
      .max(50, t('provider.state.max'))
      .matches(/^[A-Za-z\s]+$/, t('provider.state.invalid'))
      .test('trim-check', t('provider.state.trim'), (val) => val === val?.trim()),
    email: yup.string().email(t('provider.invalid_email')).matches(emailRegex, t('provider.invalid_email')).required(t('provider.email.required')),

    phoneNumber: yup
      .string()
      .required(t('provider.phone.required'))
      .matches(/^[1-9]\d{9}$/, t('provider.phone.format')),

    fax: yup.string().matches(faxRegex, t('provider.fax.format'))
  });

export const INITIAL_VALUES_FOR_PROVIDER = {
  firstName: '',
  middleName: '',
  lastName: '',
  deaNumber: '',
  npiNumber: '',
  tinNumber: '',
  medicaidNumber: '',
  licenseState: '',
  address1: '',
  address2: '',
  city: '',
  zip: '',
  state: '',
  email: '',
  phoneNumber: '',
  fax: ''
};
