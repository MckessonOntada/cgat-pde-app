import * as Yup from 'yup';
import { ALPHA_NUMERIC_ONLY } from '@src/components/form/ValidationRegExp';
import { CHANNEL_TYPE, MANUFACTURER, ORDER_STAGES } from '../Constants';
import { REQUIREMENT } from '@src/mfe/core-config/system-admin/manage-material/assets/constants/MaterialConstants';

export const getUpdateFormConfig = (
  stage,
  therapyConfig,
  spTherapyConfig,
  channelType,
  isCustomerCentreUser,
  manufacturer,
  { doseIdentifierOptions = [], handleCoiIdValidation, handleDoseIdentifierValidation, t } = {}
) => {
  const dynamic_fields = [];
  if (stage === ORDER_STAGES.PATIENT_DETAILS) {
    if (channelType === CHANNEL_TYPE.BUY_AND_BILL) {
      therapyConfig?.config?.fields?.forEach((field) => {
        if (
          field?.properties?.displayOnForm &&
          (field.fieldName === 'patientIdentifier' || (!isCustomerCentreUser && field.fieldName === 'medicalRecordNumber'))
        ) {
          const prefix = field?.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
          const suffix = field?.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';
          const isRequired =
            field?.properties?.mandatoryField ||
            (isCustomerCentreUser &&
              field.fieldName === 'patientIdentifier' &&
              [MANUFACTURER.ORCA, MANUFACTURER.KITE, MANUFACTURER.REGENERON].includes(manufacturer));
          dynamic_fields.push({
            id: `patient-info-${field.fieldName}`,
            name: field?.fieldName,
            label: field?.properties?.displayName,
            isRequired: isRequired,
            type: prefix || suffix ? 'inputText' : field?.properties.fieldFormat.formatType === 'Date_MM_DD_YYYY' ? 'datePicker' : 'input',
            prefix,
            suffix,
            infoText: field?.properties.helpInfoMessage
          });
        }
      });
      if (isCustomerCentreUser && manufacturer === MANUFACTURER.ORCA) {
        dynamic_fields.push({
          id: 'patient-info-manufacturerOrderId',
          name: 'manufacturerOrderId',
          label: 'Orca Therapy Id',
          isRequired: true,
          type: 'input',
          maxLength: 80
        });
      }
    } else {
      spTherapyConfig?.config?.fields?.forEach((field) => {
        if (
          field?.properties?.displayOnForm &&
          (field.fieldName === 'patientIdentifier' || field.fieldName === 'medicalRecordNumber' || field.fieldName === 'coiId')
        ) {
          const prefix = field?.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
          const suffix = field?.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';
          dynamic_fields.push({
            id: `patient-info-${field.fieldName}`,
            name: field?.fieldName,
            label: field?.properties?.displayName,
            isRequired: field?.properties?.mandatoryField || (!isCustomerCentreUser && field.fieldName === 'patientIdentifier'),
            type: prefix || suffix ? 'inputText' : field?.properties.fieldFormat.formatType === 'Date_MM_DD_YYYY' ? 'datePicker' : 'input',
            prefix,
            suffix,
            infoText: field?.properties.helpInfoMessage
          });
        }
      });
    }
  } else if (stage === ORDER_STAGES.ADDITIONAL_DETAILS) {
    if (manufacturer === MANUFACTURER.MERCK) {
      therapyConfig?.config?.fields?.forEach((field) => {
        if (field.fieldName === 'coiId' && field?.properties?.displayOnForm) {
          const prefix = field?.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
          const suffix = field?.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';
          dynamic_fields.push({
            id: `additional-details-${field.fieldName}`,
            name: field?.fieldName,
            label: field?.properties?.displayName,
            isRequired: field?.properties?.mandatoryField,
            type: prefix || suffix ? 'inputText' : 'input',
            prefix,
            suffix,
            infoText: field?.properties.helpInfoMessage,
            onBlur: handleCoiIdValidation
          });
        }
      });
      dynamic_fields.push({
        id: 'additional-details-doseIdentifier',
        name: 'doseIdentifier',
        label: t ? t('labels.doseIdentifier') : 'labels.doseIdentifier',
        placeholder: 'Select Dose Identifier',
        isRequired: true,
        type: 'dropdown',
        options: doseIdentifierOptions,
        onChangeHandler: handleDoseIdentifierValidation,
        isDisabled: doseIdentifierOptions.length === 0,
        disabled: doseIdentifierOptions.length === 0,
        size: 'lg'
      });
      therapyConfig?.config?.fields?.forEach((field) => {
        if (field.fieldName !== 'patientIdentifier' && field.fieldName !== 'medicalRecordNumber' && field.fieldName !== 'coiId' && field?.properties?.displayOnForm) {
          const prefix = field?.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
          const suffix = field?.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';
          const formatType = field?.properties?.fieldFormat?.formatType;
          dynamic_fields.push({
            id: `additional-details-${field.fieldName}`,
            name: field?.fieldName,
            label: field?.properties?.displayName,
            isRequired: field?.properties?.mandatoryField,
            type: prefix || suffix ? 'inputText' : formatType === 'Date_MM_DD_YYYY' ? 'datePicker' : formatType === 'Time_HH_MM' ? 'time' : 'input',
            prefix,
            suffix,
            ...(formatType === 'Date_MM_DD_YYYY' && { disablePast: true }),
            infoText: field?.properties.helpInfoMessage
          });
        }
      });
    } else {
      therapyConfig?.config?.fields?.forEach((field) => {
        if (field.fieldName !== 'patientIdentifier' && field.fieldName !== 'medicalRecordNumber' && field?.properties?.displayOnForm) {
          const prefix = field?.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
          const suffix = field?.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';
          const formatType = field?.properties?.fieldFormat?.formatType;
          dynamic_fields.push({
            id: `additional-details-${field.fieldName}`,
            name: field?.fieldName,
            label: field?.properties?.displayName,
            isRequired: field?.properties?.mandatoryField,
            type: prefix || suffix ? 'inputText' : formatType === 'Date_MM_DD_YYYY' ? 'datePicker' : formatType === 'Time_HH_MM' ? 'time' : 'input',
            prefix,
            suffix,
            ...(formatType === 'Date_MM_DD_YYYY' && { disablePast: true }),
            infoText: field?.properties.helpInfoMessage
          });
        }
      });
    }
  }
  const formattedControls = [
    {
      rows: dynamic_fields.map((control, index) => ({
        grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-start',
        controls: [control]
      }))
    }
  ];

  return formattedControls;
};

export const patientDetailsValidationSchema = (t, therapyConfig, channelType, isCustomerCentreUser, manufacturer) => {
  const buildDynamicFieldValidators = (config, t) => {
    const dynamicFields = {};
    const allowedFields = new Set(['patientIdentifier']);
    if (!isCustomerCentreUser && channelType !== CHANNEL_TYPE.SPECIALTY_PHARMA) allowedFields.add('medicalRecordNumber');
    if (channelType === CHANNEL_TYPE.SPECIALTY_PHARMA) allowedFields.add('coiId');

    config?.config?.fields?.forEach((field) => {
      if (!allowedFields.has(field.fieldName) || !field.properties?.displayOnForm) return;

      let validator = Yup.string().matches(field.properties.fieldFormat.validationRegex, field.properties.errorMessage);

      validator = validator.test(
        'no-leading-trailing-spaces',
        field.properties.errorMessage,
        (value) => value === undefined || value === null || value.trim().length === value.length
      );

      if (field.properties.fieldFormat.formatType === 'Date_MM_DD_YYYY') {
        const vf = field.properties.fieldFormat.validationFormat || '';

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

      validator = validator.when([], {
        is: () =>
          field.properties.mandatoryField ||
          (isCustomerCentreUser &&
            field.fieldName === 'patientIdentifier' &&
            [MANUFACTURER.ORCA, MANUFACTURER.KITE, MANUFACTURER.REGENERON].includes(manufacturer)),
        then: (s) => s.required(`${field.properties.displayName} is required`),
        otherwise: (s) => s.notRequired()
      });

      dynamicFields[field.fieldName] = validator;
    });
    if (isCustomerCentreUser && manufacturer === MANUFACTURER.ORCA) {
      dynamicFields.manufacturerOrderId = Yup.string()
        .matches(/^[^\s]+$/, 'Please enter valid Orca Therapy Id')
        .required('Orca therapy ID is required');
    }
    return dynamicFields;
  };

  return Yup.object().shape(buildDynamicFieldValidators(therapyConfig, t));
};

export const additionalDetailsValidationSchema = (t, therapyConfig, manufacturer) => {
  const buildDynamicFieldValidators = (config, t) => {
    const dynamicFields = {};
    const allowedFields = new Set([
      'coiId',
      'poNumber',
      'shipToPONumber',
      'dateOfAdministration',
      'dateOfApheresis',
      `timeOfApheresis`,
      `timeOfAdministration`
    ]);

    if (manufacturer === MANUFACTURER.MERCK) {
      dynamicFields.doseIdentifier = Yup.string().required(t('labels.doseIdentifierRequired'));
    }

    config?.config?.fields?.forEach((field) => {
      if (!allowedFields.has(field.fieldName) || !field.properties?.displayOnForm) return;

      let validator = Yup.string().matches(field.properties.fieldFormat.validationRegex, field.properties.errorMessage);

      validator = validator.test(
        'no-leading-trailing-spaces',
        field.properties.errorMessage,
        (value) => value === undefined || value === null || value.trim().length === value.length
      );

      if (field.properties.fieldFormat.formatType === 'Date_MM_DD_YYYY') {
        const vf = field.properties.fieldFormat.validationFormat || '';

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

      validator = validator.when([], {
        is: () => field.properties.mandatoryField,
        then: (s) => s.required(`${field.properties.displayName} is required`),
        otherwise: (s) => s.notRequired()
      });

      dynamicFields[field.fieldName] = validator;
    });

    return dynamicFields;
  };

  return Yup.object().shape(buildDynamicFieldValidators(therapyConfig, t));
};
