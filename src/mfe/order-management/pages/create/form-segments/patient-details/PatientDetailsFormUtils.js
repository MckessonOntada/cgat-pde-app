import * as Yup from 'yup';
import { ADDRESS_REGEX, ALPHABETIC_WITH_SPACE, PHONE_REGEX, ZIP_REGEX } from '@src/components/form/ValidationRegExp';
import { US_STATES } from '@src/components/form/util';

const stateOptions = US_STATES();

export const formConfig = [
  {
    sectionTitle: 'orderManagement.patientDetails.personal_details',
    grid: { base: 1, md: 3, lg: 3, xl: 3 },
    fields: [
      {
        id: 'name.firstName',
        name: 'name.firstName',
        label: 'orderManagement.patientDetails.inputLabel.first_name',
        placeholder: ' ',
        component: 'input',
        maxLength: 50
      },
      {
        id: 'name.middleName',
        name: 'name.middleName',
        label: 'orderManagement.patientDetails.inputLabel.middle_name',
        placeholder: ' ',
        component: 'input',
        maxLength: 50
      },
      {
        id: 'name.lastName',
        name: 'name.lastName',
        label: 'orderManagement.patientDetails.inputLabel.last_name',
        placeholder: ' ',
        component: 'input',
        maxLength: 50
      },
      {
        id: 'name.gender',
        name: 'name.gender',
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
        id: 'name.DateOfBirth',
        name: 'name.DateOfBirth',
        label: 'orderManagement.patientDetails.inputLabel.date_of_birth',
        placeholder: ' ',
        component: 'input',
        maxLength: 50
      },
      {
        id: 'name.patientIdentifier',
        name: 'name.patientIdentifier',
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
        name: 'contact.email',
        label: 'orderManagement.patientDetails.inputLabel.email',
        placeholder: ' ',
        component: 'input',
        maxLength: 100
      },
      {
        name: 'contact.phone',
        label: 'orderManagement.patientDetails.inputLabel.phone_no',
        placeholder: ' ',
        component: 'phoneInput',
        maxLength: 15,
        className: 'phoneInput'
      }
    ]
  },
  {
    sectionTitle: 'orderManagement.patientDetails.contact_details',
    grid: { base: 1, md: 1, lg: 2, xl: 2 },
    fields: [
      {
        name: 'address.address1',
        label: 'orderManagement.patientDetails.inputLabel.address_1',
        placeholder: ' ',
        component: 'input',
        maxLength: 100
      },
      {
        name: 'address.address2',
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
        name: 'address.city',
        label: 'orderManagement.patientDetails.inputLabel.city',
        placeholder: ' ',
        component: 'input',
        maxLength: 15
      },
      {
        name: 'address.zip',
        label: 'orderManagement.patientDetails.inputLabel.zip',
        placeholder: ' ',
        component: 'zipInput',
        maxLength: 8
      },
      {
        name: 'address.state',
        label: 'orderManagement.patientDetails.inputLabel.state',
        placeholder: ' ',
        component: 'dropdown',
        options: stateOptions
      }
    ]
  }
];

export const getValidationSchema = (t) => {
  return Yup.object({
    name: Yup.object({
      firstName: Yup.string()
        .matches(ALPHABETIC_WITH_SPACE, t('orgManagement.create_org.validation.contact_person_first_name_invalid'))
        .min(2, t('orgManagement.create_org.validation.first_name_min'))
        .max(50, t('orgManagement.create_org.validation.first_name_max')),
      middleName: Yup.string()
        .matches(ALPHABETIC_WITH_SPACE, t('orgManagement.create_org.validation.middle_name_invalid'))
        .min(2, t('orgManagement.create_org.validation.middle_name_min'))
        .max(50, t('orgManagement.create_org.validation.middle_name_max')),
      lastName: Yup.string()
        .matches(ALPHABETIC_WITH_SPACE, t('orgManagement.create_org.validation.contact_person_last_name_invalid'))
        .min(2, t('orgManagement.create_org.validation.last_name_min'))
        .max(50, t('orgManagement.create_org.validation.last_name_max')),
      gender: Yup.string(),
      dateOfBirth: Yup.string(),
      patientIdentifier: Yup.string()
        .required(t('orderManagement.patientDetails.validation.patient_identifier_required'))
        .max(20, t('orderManagement.patientDetails.validation.patient_identifier_max'))
    }),
    contact: Yup.object({
      email: Yup.string()
        .email(t('orderManagement.patientDetails.validation.invalid_email'))
        .max(50, t('orderManagement.patientDetails.validation.email_max')),
      phone: Yup.string()
        .matches(PHONE_REGEX, t('orderManagement.patientDetails.validation.phone_invalid'))
        .max(15, t('orderManagement.patientDetails.validation.phone_max'))
    }),
    address: Yup.object({
      address1: Yup.string()
        .matches(ADDRESS_REGEX, t('orgManagement.create_org.validation.address_1_invalid'))
        .min(2, t('orgManagement.create_org.validation.address_1_min'))
        .max(100, t('orgManagement.create_org.validation.address_1_max')),
      address2: Yup.string()
        .matches(ADDRESS_REGEX, t('orgManagement.create_org.validation.address_2_invalid'))
        .min(2, t('orgManagement.create_org.validation.address_2_min'))
        .max(250, t('orgManagement.create_org.validation.address_2_max')),
      city: Yup.string()
        .matches(ALPHABETIC_WITH_SPACE, t('orgManagement.create_org.validation.city_invalid'))
        .min(2, t('orgManagement.create_org.validation.city_min'))
        .max(50, t('orgManagement.create_org.validation.city_max')),
      zip: Yup.string()
        .matches(ZIP_REGEX, t('orgManagement.create_org.validation.zip_invalid'))
        .max(10, t('orgManagement.create_account.validation.zip_max')),
      state: Yup.string()
    })
  });
};
