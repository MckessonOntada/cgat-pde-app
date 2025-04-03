import * as Yup from 'yup';
import {
  CUSTOM_ADDRESS_REGEX,
  ALPHABETIC_WITH_SPACE,
  ZIP_REGEX,
  ALPHABETIC_WITH_SPECIAL,
  PHONE_REGEX,
  FAX_REGEX,
  ADDRESS_REGEX,
  FAX_REGEX_WITHOUTSPECIAL,
  ALPHABETIC_ONLY,
  MIDDLE_NAME_REGEX,
  FIRST_NAME_REGEX,
  ALPHA_NUMERIC_WITH_SPECIALCHARS
} from '@src/components/form/ValidationRegExp';

export const validationSchemaforSPAccount = (t) => {
  return Yup.object({
    accountName: Yup.string()
      .required(t('manageSPAccount.spaccount.inputLabel.accountName.required'))
      .test(
        'no-leading-trailing-spaces',
        t('manageSPAccount.spaccount.inputLabel.accountName.trimError'),
        (value) => value === undefined || value.trim().length === value.length
      )
      .matches(ALPHA_NUMERIC_WITH_SPECIALCHARS, t('manageSPAccount.spaccount.inputLabel.accountName_validate')),

    name: Yup.object({
      firstName: Yup.string()
        .required(t('manageSPAccount.spaccount.inputLabel.firstName.required'))
        .test(
          'no-leading-trailing-spaces',
          t('manageSPAccount.spaccount.inputLabel.firstName.trimError'),
          (value) => value === undefined || value.trim().length === value.length
        )
        .matches(FIRST_NAME_REGEX, t('manageSPAccount.spaccount.inputLabel.firstName.validate')),

      middleName: Yup.string()
        .nullable()
        .test(
          'no-leading-trailing-spaces',
          t('manageSPAccount.spaccount.inputLabel.middleName.trimError'),
          (value) => value === null || value === undefined || value.trim().length === value.length
        )
        .matches(MIDDLE_NAME_REGEX, t('manageSPAccount.spaccount.inputLabel.middleName.validate')),

      lastName: Yup.string()
        .required(t('manageSPAccount.spaccount.inputLabel.lastName.required'))
        .test(
          'no-leading-trailing-spaces',
          t('manageSPAccount.spaccount.inputLabel.lastName.trimError'),
          (value) => value === undefined || value.trim().length === value.length
        )
        .matches(ALPHABETIC_ONLY, t('manageSPAccount.spaccount.inputLabel.lastName.validate'))
    }),

    contact: Yup.object({
      email: Yup.string()
        .email(t('manageSPAccount.spaccount.inputLabel.email.validate'))
        .required(t('manageSPAccount.spaccount.inputLabel.email.required')),

      phone: Yup.string()
        .required(t('manageSPAccount.spaccount.inputLabel.phone.required'))
        .matches(PHONE_REGEX, t('manageSPAccount.spaccount.inputLabel.phone.validate')),

      fax: Yup.string()
        .matches(FAX_REGEX_WITHOUTSPECIAL, t('manageSPAccount.spaccount.inputLabel.fax.length'))
        .min(6, t('manageSPAccount.spaccount.inputLabel.fax.length'))
        .max(15, t('manageSPAccount.spaccount.inputLabel.fax.length'))
    }),

    address: Yup.object({
      address1: Yup.string()
        .required(t('manageSPAccount.spaccount.inputLabel.address_1.required'))
        .test(
          'no-leading-trailing-spaces',
          t('manageSPAccount.spaccount.inputLabel.address_1.trimError'),
          (value) => value === undefined || value.trim().length === value.length
        )
        .matches(ADDRESS_REGEX, t('manageSPAccount.spaccount.inputLabel.address_1_validate'))
        .min(2, t('manageSPAccount.spaccount.inputLabel.address_1_validate'))
        .max(100, t('manageSPAccount.spaccount.inputLabel.address_1_validate')),

      address2: Yup.string()
        .test(
          'no-leading-trailing-spaces',
          t('manageSPAccount.spaccount.inputLabel.address_2.trimError'),
          (value) => value === undefined || value.trim().length === value.length
        )
        .matches(ADDRESS_REGEX, t('manageSPAccount.spaccount.inputLabel.address_2_validate')),

      city: Yup.string()
        .required(t('manageSPAccount.spaccount.inputLabel.city.required'))
        .test(
          'no-leading-trailing-spaces',
          t('manageSPAccount.spaccount.inputLabel.city.trimError'),
          (value) => value === undefined || value.trim().length === value.length
        )
        .matches(ALPHABETIC_WITH_SPACE, t('manageSPAccount.spaccount.inputLabel.city.validate'))
        .min(2, t('manageSPAccount.spaccount.inputLabel.city.validate'))
        .max(50, t('manageSPAccount.spaccount.inputLabel.city.validate')),

      zip: Yup.string()
        .required(t('manageSPAccount.spaccount.inputLabel.zip.required'))
        .matches(ZIP_REGEX, t('manageSPAccount.spaccount.inputLabel.zip.validate'))
        .max(10, t('manageSPAccount.spaccount.inputLabel.zip.validate')),

      state: Yup.string().required(t('manageSPAccount.spaccount.inputLabel.state.required'))
    })
  });
};

export const initialValuesforSPAccount = {
  accountName: '',
  name: {
    firstName: '',
    middleName: '',
    lastName: ''
  },
  contact: {
    email: '',
    phone: '',
    fax: ''
  },
  address: {
    address1: '',
    address2: '',
    city: '',
    zip: '',
    state: ''
  }
};

export const validationSchemaforShippingAddress = (t) => {
  return Yup.object({
    locationName: Yup.string().required('Please enter Location Name'),
    address1: Yup.string()
      .required(t('manageSPAccount.shippingLocation.inputLabel.address_1.required'))
      .test(
        'no-leading-trailing-spaces',
        t('manageSPAccount.shippingLocation.inputLabel.address_1.trimError'),
        (value) => value === undefined || value.trim().length === value.length
      )
      .matches(CUSTOM_ADDRESS_REGEX, t('manageSPAccount.shippingLocation.inputLabel.address_1_validate')),
    address2: Yup.string()
      .test(
        'no-leading-trailing-spaces',
        t('manageSPAccount.shippingLocation.inputLabel.address_2.trimError'),
        (value) => value === undefined || value.trim().length === value.length
      )
      .matches(CUSTOM_ADDRESS_REGEX, t('manageSPAccount.shippingLocation.inputLabel.address_2_validate')),
    city: Yup.string()
      .required(t('manageSPAccount.shippingLocation.inputLabel.city.required'))
      .test(
        'no-leading-trailing-spaces',
        t('manageSPAccount.shippingLocation.inputLabel.city.trimError'),
        (value) => value === undefined || value.trim().length === value.length
      )
      .matches(ALPHABETIC_WITH_SPACE, t('manageSPAccount.shippingLocation.inputLabel.city.validate')),
    zip: Yup.string()
      .required(t('manageSPAccount.shippingLocation.inputLabel.zip.required'))
      .matches(ZIP_REGEX, t('manageSPAccount.shippingLocation.inputLabel.zip.validate')),
    state: Yup.string().required(t('manageSPAccount.shippingLocation.inputLabel.state.required'))
  });
};

export const initialValuesforShippingAddress = {
  locationName: '',
  address1: '',
  address2: '',
  city: '',
  zip: '',
  state: ''
};
