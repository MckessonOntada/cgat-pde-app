import * as Yup from 'yup';
import { ADDRESS_REGEX, ALPHABETIC_ONLY, ALPHABETIC_WITH_SPACE, PHONE_REGEX, ZIP_REGEX, ALPHABETIC_WITH_SPECIAL_AND_ACCENTED } from '@src/components/form/ValidationRegExp';
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
  },
  {
    sectionTitle: 'orderManagement.patientDetails.contact_details',
    grid: { base: 1, md: 3, lg: 2, xl: 3 },
    fields: [
      {
        name: 'contact.emailId',
        label: 'orderManagement.patientDetails.inputLabel.email',
        placeholder: ' ',
        component: 'input',
        maxLength: 100
      },
      {
        name: 'contact.phoneNumber',
        label: 'orderManagement.patientDetails.inputLabel.phone_no',
        placeholder: ' ',
        component: 'phoneInput',
        maxLength: 15,
        className: 'phoneInput'
      }
    ]
  },
  {
    sectionTitle: 'orderManagement.patientDetails.address_details',
    grid: { base: 1, md: 1, lg: 2, xl: 2 },
    fields: [
      {
        name: 'patientAddress.addressLine1',
        label: 'orderManagement.patientDetails.inputLabel.address_1',
        placeholder: ' ',
        component: 'input',
        maxLength: 100
      },
      {
        name: 'patientAddress.addressLine2',
        label: 'orderManagement.patientDetails.inputLabel.address_2',
        placeholder: ' ',
        component: 'input',
        maxLength: 100
      }
    ]
  },
  {
    sectionTitle: '',
    grid: { base: 1, md: 2, lg: 3, xl: 3 },
    fields: [
      {
        name: 'patientAddress.city',
        label: 'orderManagement.patientDetails.inputLabel.city',
        placeholder: ' ',
        component: 'input',
        maxLength: 15
      },
      {
        name: 'patientAddress.zipCode',
        label: 'orderManagement.patientDetails.inputLabel.zip',
        placeholder: ' ',
        component: 'zipInput',
        maxLength: 8
      },
      {
        name: 'patientAddress.state',
        label: 'orderManagement.patientDetails.inputLabel.state',
        placeholder: ' ',
        component: 'dropdown',
        options: stateOptions
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
    contact: Yup.object()
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
      })
      .nullable(),
    patientAddress: Yup.object()
      .shape({
        addressLine1: Yup.string()
          .nullable()
          .trim()
          .matches(ADDRESS_REGEX, t('orgManagement.create_org.validation.address_1_invalid'))
          .min(2, t('orgManagement.create_org.validation.address_1_min'))
          .max(100, t('orgManagement.create_org.validation.address_1_max')),
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
          .max(15, t('orgManagement.create_org.validation.city_max')),
        zipCode: Yup.string()
          .nullable()
          .trim()
          .matches(ZIP_REGEX, t('orgManagement.create_org.validation.zip_invalid'))
          .max(10, t('orgManagement.create_account.validation.zip_max')),
        state: Yup.string().nullable()
      })
      .nullable(),
    patientIdentifier: Yup.string()
      .trim()
      .matches(/^\d{1,20}$/, t('orderManagement.patientDetails.validation.patient_identifier_must_number'))
      .required(t('orderManagement.patientDetails.validation.patient_identifier_required'))
      .max(20, t('orderManagement.patientDetails.validation.patient_identifier_max'))
  });
};
