import * as yup from 'yup';

const nameRegex = /^[A-Za-z\s.-]+$/;
const middleNameRegex = /^[A-Za-z.]+$/;
const lastNameRegex = /^[A-Za-z]+$/;
const deaRegex = /^[A-Z]{2}\d{6}\d$/;
const npiRegex = /^\d{10}$/;
const addressRegex = /^[A-Za-z0-9\s,./-]+$/;
const cityRegex = /^[A-Za-z\s]+$/;
const zipRegex = /^\d{5}(-\d{4})?$/;
const phoneRegex = /^[1-9]\d{9}$/;

const trimCheck = (message) =>
  yup
    .string()
    .test(
      'no-leading-trailing-space',
      message,
      (val) => !val || val === val.trim()
    );

export const providerSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Please Enter First Name')
    .max(50, 'First Name should not exceed 50 characters.')
    .matches(
      nameRegex,
      'First Name can only contain alphabets, spaces, ".", and "-".'
    )
    .test(
      'trim-check',
      'First Name cannot start or end with a space.',
      (val) => val === val?.trim()
    ),

  middleName: yup
    .string()
    .max(50, 'Middle Name should not exceed 50 characters.')
    .matches(middleNameRegex, 'Middle Name can only contain alphabets and ".".')
    .test(
      'trim-check',
      'Middle Name cannot start or end with a space.',
      (val) => !val || val === val.trim()
    ),

  lastName: yup
    .string()
    .required('Please enter Last Name')
    .max(50, 'Last Name should not exceed 50 characters.')
    .matches(lastNameRegex, 'Last Name can only contain alphabets.')
    .test(
      'trim-check',
      'Last Name cannot start or end with a space.',
      (val) => val === val?.trim()
    ),

  deaNumber: yup
    .string()
    .required('Please Enter DEA Number')
    .max(9, 'DEA Number should not exceed 9 characters.')
    .matches(
      /^[A-Za-z0-9]+$/,
      'DEA Number should only contain alphanumeric characters.'
    )
    .matches(
      /^[A-Z]{2}\d{6}\d$/,
      'DEA Number must follow the format: 2 letters, 6 digits, 1 check digit.'
    )
    .test(
      'no-spaces-or-hyphens',
      'DEA Number cannot contain spaces or hyphens.',
      (val) => !val.includes(' ') && !val.includes('-')
    ),

  npiNumber: yup
    .string()
    .required('Please Enter NPI Number')
    .length(10, 'NPI Number should be exactly 10 digits.')
    .matches(/^\d+$/, 'NPI Number should only contain numeric digits.'),

  address1: yup
    .string()
    .required('Please enter Address 1.')
    .max(100, 'Address 1 should not exceed 100 characters.')
    .matches(addressRegex, 'Address 1 contains invalid characters.')
    .test(
      'trim-check',
      'Address 1 cannot start or end with a space.',
      (val) => val === val?.trim()
    ),

  address2: yup
    .string()
    .max(100, 'Address 2 should not exceed 100 characters.')
    .matches(addressRegex, 'Address 2 contains invalid characters.')
    .test(
      'trim-check',
      'Address 2 cannot start or end with a space.',
      (val) => !val || val === val.trim()
    ),

  city: yup
    .string()
    .required('Please enter the City.')
    .max(50, 'City should not exceed 50 characters.')
    .matches(cityRegex, 'City can only contain alphabets and spaces.')
    .test(
      'trim-check',
      'City cannot start or end with a space.',
      (val) => val === val?.trim()
    ),

  zip: yup
    .string()
    .required('Please enter the Zip Code.')
    .matches(zipRegex, 'Zip Code must be in format: 12345 or 12345-6789.')
    .test(
      'no-spaces',
      'Zip Code cannot contain spaces.',
      (val) => !val.includes(' ')
    ),

  state: yup
    .string()
    .required('State is required.')
    .max(50, 'State should not exceed 50 characters.')
    .matches(
      /^[A-Za-z\s]+$/,
      'State name can only contain alphabets and spaces.'
    )
    .test(
      'trim-check',
      'State cannot start or end with a space.',
      (val) => val === val?.trim()
    ),

  phoneNumber: yup
    .string()
    .required('Please enter your Phone Number.')
    .matches(
      /^\d{10}$/,
      'Phone Number should be exactly 10 digits and cannot start with 0 or contain symbols or spaces.'
    )
});
