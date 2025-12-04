import { ADDRESS_REGEX, ALPHA_NUMERIC_ONLY, ALPHABETIC_WITH_SPACE, PHONE_REGEX, ZIP_REGEX } from '@src/components/form/ValidationRegExp';
import { REQUIREMENT } from '@src/mfe/core-config/system-admin/manage-material/assets/constants/MaterialConstants';
import CommonUtils from '@src/util/CommonUtils';
import * as Yup from 'yup';

export const getInitialValues = () => ({
  patient: {
    patientInfo: {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dateOfBirth: ''
    },
    contact: {
      emailId: '',
      phoneNumber: '',
      homePhone: '',
      workPhone: '',
      preferedMethodOfContact: ''
    },
    patientAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      zipCode: '',
      state: ''
    },
    patientIdentifier: '',
    medicalRecordNumber: '',
    coiId: ''
  },
  providerId: ''
});

export const normalizePatient = (patient) => {
  const p = patient || {};
  return {
    ...p,
    contact: {
      emailId: '',
      phoneNumber: '',
      homePhone: '',
      workPhone: '',
      preferedMethodOfContact: '',
      ...(p.contact || {})
    },
    patientAddress: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      zipCode: '',
      state: '',
      ...(p.patientAddress || {})
    },
    patientInfo: {
      firstName: '',
      middleName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      ...(p.patientInfo || {})
    }
  };
};

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

export const getValidationSchema = (t, isSpOrder, spMaterialConfig, therapyConfig) => {
  const buildDynamicFieldValidators = (config, t) => {
    const dynamicFields = {};
    const allowedFields = new Set(['patientIdentifier', 'medicalRecordNumber']);
    if (isSpOrder) allowedFields.add('coiId');
    config?.config?.fields?.forEach((field) => {
      if (allowedFields.has(field.fieldName) && field.properties.displayOnForm) {
        if (!field.properties.displayOnForm) return;

        let validator = Yup.string().matches(field.properties.fieldFormat.validationRegex, t('Please enter valid input'));

        if (field.properties.fieldFormat.formatType === 'Date_MM_DD_YYYY') {
          const vf = field.properties.fieldFormat.validationFormat;

          const minMatch = vf.match(/minDate\('([^']+)'\)/);
          const maxMatch = vf.match(/maxDate\('([^']+)'\)/);

          const minDate = minMatch ? minMatch[1] : null;
          const maxDate = maxMatch ? maxMatch[1] : null;

          validator = validator.test('date-range', `Please enter a date between ${minDate} and ${maxDate}.`, (value) => {
            if (!value) return true;

            const toDate = (d) => {
              const [m, day, y] = d.split('/');
              return new Date(`${y}-${m}-${day}`);
            };

            const inputDate = toDate(value);
            if (minDate && inputDate < toDate(minDate)) return false;
            if (maxDate && inputDate > toDate(maxDate)) return false;

            return true;
          });
        }

        validator = validator.when([], {
          is: () => field.properties.mandatoryField,
          then: (s) => s.required(field.properties.errorMessage),
          otherwise: (s) => s.notRequired()
        });

        dynamicFields[field.fieldName] = validator;
      }
    });

    return dynamicFields;
  };

  const configToUse = isSpOrder ? spMaterialConfig : therapyConfig;

  return Yup.object().shape({
    patient: Yup.object().shape({
      patientInfo: Yup.object()
        .nullable()
        .shape({
          firstName: CommonUtils.getNameValidation(t, {
            field: 'first_name',
            required: isSpOrder
          }),
          middleName: CommonUtils.getNameValidation(t, { field: 'middle_name' }),
          lastName: CommonUtils.getNameValidation(t, {
            field: 'last_name',
            required: isSpOrder
          }),
          dateOfBirth: Yup.date()
            .max(yesterday, t('labels.invalidDateOfBirth'))
            .typeError(t('labels.selectValidDate'))
            .when([], {
              is: () => isSpOrder,
              then: (schema) => schema.required(t('orderManagement.patientDetails.validation.dateOfBirth')),
              otherwise: (schema) => schema.nullable()
            }),
          gender: Yup.string()
            .oneOf(['Male', 'Female', 'Other'], t('labels.invalidGenderSelection'))
            .when([], {
              is: () => isSpOrder,
              then: (schema) => schema.required(t('orderManagement.patientDetails.validation.gender')),
              otherwise: (schema) => schema.nullable()
            })
        }),
      ...(isSpOrder && {
        contact: Yup.object()
          .nullable()
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
              .required(t('orderManagement.patientDetails.validation.phone_no')),
            homePhone: Yup.string().nullable(),
            workPhone: Yup.string().nullable(),
            preferedMethodOfContact: Yup.string().nullable().oneOf(['Mobile', 'Fax'], 'Select valid method of contact.')
          })
      }),
      ...(isSpOrder && {
        patientAddress: Yup.object()
          .nullable()
          .shape({
            addressLine1: Yup.string()
              .nullable()
              .trim()
              .matches(ADDRESS_REGEX, t('orgManagement.create_org.validation.address_1_invalid'))
              .min(2, t('orgManagement.create_org.validation.address_1_min'))
              .max(100, t('orgManagement.create_org.validation.address_1_max'))
              .required(t('orderManagement.patientDetails.validation.address_1')),
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
              .max(15, t('orgManagement.create_org.validation.city_max'))
              .required(t('orderManagement.patientDetails.validation.city')),
            zipCode: Yup.string()
              .nullable()
              .trim()
              .matches(ZIP_REGEX, t('orgManagement.create_org.validation.zip_invalid'))
              .max(10, t('orgManagement.create_account.validation.zip_max'))
              .required(t('orderManagement.patientDetails.validation.zip')),
            state: Yup.string().nullable().required(t('orderManagement.patientDetails.validation.state'))
          })
      }),

      ...buildDynamicFieldValidators(configToUse, t)
    }),
    providerId: Yup.string().when([], {
      is: () => isSpOrder,
      then: (schema) => schema.required('Please select provider.'),
      otherwise: (schema) => schema.notRequired()
    })
  });
};

export const getAdditionalContactSchema = (t) => {
  return Yup.object().shape({
    homePhone: Yup.string().matches(PHONE_REGEX, t('validation.phone_no')),
    mobileNumber: Yup.string().matches(PHONE_REGEX, t('validation.phone_no')),
    workPhone: Yup.string().matches(PHONE_REGEX, t('validation.phone_no')),
    preferredMethodOfContact: Yup.string().oneOf(['Mobile', 'Fax'], 'Preferred method of contact must be either Mobile or Fax'),
    provider: Yup.string().nullable()
  });
};
