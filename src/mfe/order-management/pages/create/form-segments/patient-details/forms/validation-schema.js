import { ADDRESS_REGEX, ALPHA_NUMERIC_ONLY, ALPHABETIC_WITH_SPACE, PHONE_REGEX, ZIP_REGEX } from '@src/components/form/ValidationRegExp';
import { REQUIREMENT } from '@src/mfe/core-config/system-admin/manage-material/assets/constants/MaterialConstants';
import CommonUtils from '@src/util/CommonUtils';
import * as Yup from 'yup';
import { removePrefixSuffix } from '../../OrderUtil';

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

export const getValidationSchema = (t, isSpOrder, spMaterialConfig, therapyConfig, manufacturer) => {
  const buildDynamicFieldValidators = (config, t) => {
    const dynamicFields = {};
    const allowedFields = new Set(['patientIdentifier', 'medicalRecordNumber']);
    if (isSpOrder) allowedFields.add('coiId');
    const isOrca = manufacturer === 'ORCA';

    config?.config?.fields?.forEach((field) => {
      if (!allowedFields.has(field.fieldName) || !field.properties.displayOnForm) return;

      let validator = Yup.string().matches(removePrefixSuffix(field.properties.fieldFormat.validationRegex), field.properties.errorMessage);

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
      if (field.properties.fieldFormat.formatType === 'Integer') {
        const vf = field.properties.fieldFormat.validationFormat || '';

        const minMatch = vf.match(/minValue\('([^']+)'\)/);
        const maxMatch = vf.match(/maxValue\('([^']+)'\)/);

        const minValue = minMatch ? Number(minMatch[1]) : null;
        const maxValue = maxMatch ? Number(maxMatch[1]) : null;

        validator = validator.test('integer-range', field.properties.errorMessage, (value) => {
          if (value === undefined || value === null || value === '') return true;

          const num = Number(value);

          if (Number.isNaN(num)) return false;

          if (minValue !== null && num < minValue) return false;
          if (maxValue !== null && num > maxValue) return false;

          return true;
        });
      }
      if (!isOrca) {
        validator = validator.when([], {
          is: () => field.properties.mandatoryField,
          then: (s) => s.required(`${field.properties.displayName} is required`),
          otherwise: (s) => s.notRequired()
        });
      }

      dynamicFields[field.fieldName] = validator;
    });

    if (isOrca) {
      allowedFields.forEach((fieldName) => {
        if (!dynamicFields[fieldName]) return;
        const customizedFieldDetails = config?.config?.fields?.find((f) => f.fieldName === fieldName);

        const displayName = customizedFieldDetails?.properties?.displayName;

        const fallbackMessages = {
          patientIdentifier: 'Manufacturer Patient Identifier is required',
          medicalRecordNumber: 'Medical Record Number is required'
        };

        const message = displayName ? `${displayName} is required` : fallbackMessages[fieldName] || '';

        dynamicFields[fieldName] = dynamicFields[fieldName].test('orca-atleast-one', message, function () {
          const values = this.parent;
          return Array.from(allowedFields).some((f) => values?.[f]);
        });
      });
    }

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
