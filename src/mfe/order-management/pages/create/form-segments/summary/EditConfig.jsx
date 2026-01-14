import * as Yup from 'yup';
import { ALPHA_NUMERIC_ONLY } from '@src/components/form/ValidationRegExp';
import { ORDER_STAGES } from '../Constants';
import { REQUIREMENT } from '@src/mfe/core-config/system-admin/manage-material/assets/constants/MaterialConstants';

export const getUpdateFormConfig = (stage, therapyConfig) => {
  const dynamic_fields = [];
  if (stage === ORDER_STAGES.PATIENT_DETAILS) {
    therapyConfig?.config?.fields?.forEach((field) => {
      if (field?.properties?.displayOnForm && (field.fieldName === 'patientIdentifier' || field.fieldName === 'medicalRecordNumber')) {
        const prefix = field?.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
        const suffix = field?.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';
        dynamic_fields.push({
          id: `patient-info-${field.fieldName}`,
          name: field?.fieldName,
          label: field?.properties?.displayName,
          isRequired: field?.properties?.mandatoryField,
          type: prefix || suffix ? 'inputText' : field?.properties.fieldFormat.formatType === 'Date_MM_DD_YYYY' ? 'datePicker' : 'input',
          prefix,
          suffix,
          infoText: field?.properties.helpInfoMessage
          // ...(field.fieldName === 'coiId' && { onBlur: handleCoiIdValidation })
        });
      }
    });
    console.log('dynamic_fields', dynamic_fields);
  } else if (stage === ORDER_STAGES.ADDITIONAL_DETAILS) {
    therapyConfig?.config?.fields?.forEach((field) => {
      if (field.fieldName !== 'patientIdentifier' && field.fieldName !== 'medicalRecordNumber' && field?.properties?.displayOnForm) {
        const prefix = field?.properties?.fieldFormat?.validationFormat?.match(/prefix\('([^']*)'\)/)?.[1] ?? '';
        const suffix = field?.properties?.fieldFormat?.validationFormat?.match(/suffix\('([^']*)'\)/)?.[1] ?? '';
        dynamic_fields.push({
          id: `additional-details-${field.fieldName}`,
          name: field?.fieldName,
          label: field?.properties?.displayName,
          isRequired: field?.properties?.mandatoryField,
          type: prefix || suffix ? 'inputText' : field?.properties.fieldFormat.formatType === 'Date_MM_DD_YYYY' ? 'datePicker' : 'input',
          prefix,
          suffix,
          infoText: field?.properties.helpInfoMessage
          // ...(field.fieldName === 'coiId' && { onBlur: handleCoiIdValidation })
        });
      }
    });
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

export const patientDetailsValidationSchema = (t, therapyConfig) =>
  Yup.object().shape({
    patientIdentifier: Yup.string()
      .matches(ALPHA_NUMERIC_ONLY, t('orderManagement.patientDetails.validation.patient_identifier_must_number'))
      .max(20, t('orderManagement.patientDetails.validation.patient_identifier_max'))
      .when([], {
        is: () => therapyConfig.patientIdentifierRequirement === REQUIREMENT.MANDATORY,
        then: (schema) =>
          schema
            .required(t('orderManagement.patientDetails.validation.patient_identifier_required'))
            .test(
              'no-leading-trailing-spaces',
              t('orderManagement.patientDetails.validation.patient_identifier_must_number'),
              (value) => value === undefined || value.trim().length === value.length
            ),
        otherwise: (schema) => schema.notRequired()
      }),
    medicalRecordNumber: Yup.string()
      .matches(ALPHA_NUMERIC_ONLY, t('orderManagement.patientDetails.validation.mrn_must_alphanumeric'))
      .test(
        'no-leading-trailing-spaces',
        t('orderManagement.patientDetails.validation.mrn_must_alphanumeric'),
        (value) => value === undefined || value === null || value?.trim().length === value.length
      )
      .when([], {
        is: () => therapyConfig?.mrnRequirement === REQUIREMENT.MANDATORY,
        then: (schema) => schema.required(t('orderManagement.patientDetails.validation.mrn_required')),
        otherwise: (schema) => schema.notRequired()
      })
  });

export const additionalDetailsValidationSchema = (t, therapyConfig) =>
  Yup.object().shape({
    coiId: Yup.string()
      .matches(ALPHA_NUMERIC_ONLY, t('labels.COI_IdMustValidNumber'))
      .max(10, t('labels.COI_IdExceedDigits'))
      .when([], {
        is: () => therapyConfig.coiIdRequirement === REQUIREMENT.MANDATORY,
        then: (schema) => schema.required(t('labels.COIIdRequired')),
        otherwise: (schema) => schema.notRequired()
      }),
    poNumber: Yup.string()
      .matches(ALPHA_NUMERIC_ONLY, t('labels.poNumberMustValid'))
      .max(35, t('labels.PONumberLengthError'))
      .test('no-leading-trailing-spaces', t('labels.poNumberExtraSpaceError'), (value) => value === undefined || value.trim().length === value.length)
      .when([], {
        is: () => therapyConfig.poNumberRequirement === REQUIREMENT.MANDATORY,
        then: (schema) => schema.required(t('labels.PONumberRequired')),
        otherwise: (schema) => schema.notRequired()
      }),
    shipToPONumber: Yup.string()
      .matches(ALPHA_NUMERIC_ONLY, t('labels.shipToPONumberMustValid'))
      .max(35, t('labels.shipToPONumberLengthError'))
      .test('no-leading-trailing-spaces', t('labels.shipToPONumberExtraSpaceError'), (value) => value === undefined || value.trim().length === value.length)
      .when([], {
        is: () => therapyConfig.shipToPORequirement === REQUIREMENT.MANDATORY,
        then: (schema) => schema.required(t('labels.shipToPONumberRequired')),
        otherwise: (schema) => schema.notRequired()
      }),
    dateOfAdministration: Yup.date()
      .typeError(t('labels.enterValidDateOfAdministration'))
      .min(new Date(), t('labels.dateOfAdministrationFutureDateOnly'))
      .when([], {
        is: () => therapyConfig.dateOfAdministrationRequirement === REQUIREMENT.MANDATORY,
        then: (schema) => schema.required(t('labels.enterValidDateOfAdministration')),
        otherwise: (schema) => schema.notRequired()
      }),
    dateOfApheresis: Yup.date()
      .typeError(t('labels.enterValidDateOfApheresis'))
      .min(new Date(), t('labels.dateOfApheresisFutureDateOnly'))
      .when([], {
        is: () => therapyConfig.dateOfApheresisRequirement === REQUIREMENT.MANDATORY,
        then: (schema) => schema.required(t('labels.enterValidDateOfApheresis')),
        otherwise: (schema) => schema.notRequired()
      })
  });
