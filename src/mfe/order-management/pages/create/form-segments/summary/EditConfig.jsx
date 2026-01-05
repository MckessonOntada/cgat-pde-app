import * as Yup from 'yup';
import { ALPHA_NUMERIC_ONLY } from '@src/components/form/ValidationRegExp';
import { ORDER_STAGES } from '../Constants';
import { REQUIREMENT } from '@src/mfe/core-config/system-admin/manage-material/assets/constants/MaterialConstants';

export const getUpdateFormConfig = (stage, therapyConfig) => {
  if (stage === ORDER_STAGES.PATIENT_DETAILS) {
    return [
      {
        rows: [
          {
            grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-start',
            controls: [
              ...(therapyConfig.patientIdentifierRequirement !== REQUIREMENT.NOT_REQUIRED
                ? [
                    {
                      id: 'patient-info-identifier',
                      name: 'patientIdentifier',
                      label: 'labels.patientIdentifier',
                      placeholder: ' ',
                      type: 'input',
                      maxLength: 20,
                      isRequired: therapyConfig.patientIdentifierRequirement == REQUIREMENT.MANDATORY
                    }
                  ]
                : []),
              ...(therapyConfig.mrnRequirement !== REQUIREMENT.NOT_REQUIRED
                ? [
                    {
                      id: 'patient-info-mrn',
                      name: 'medicalRecordNumber',
                      label: 'orderManagement.patientDetails.inputLabel.mrn',
                      placeholder: ' ',
                      type: 'input',
                      maxLength: 11,
                      isRequired: therapyConfig.mrnRequirement === REQUIREMENT.MANDATORY
                    }
                  ]
                : [])
            ]
          }
        ]
      }
    ];
  } else if (stage === ORDER_STAGES.ADDITIONAL_DETAILS) {
    const controls = [
      ...(therapyConfig.dateOfAdministrationRequirement != REQUIREMENT.NOT_REQUIRED
        ? [
            {
              id: 'patient-info-doa',
              name: 'dateOfAdministration',
              label: 'orderManagement.patientDetails.inputLabel.doa',
              placeholder: ' ',
              type: 'datePicker',
              isRequired: therapyConfig.dateOfAdministrationRequirement == REQUIREMENT.MANDATORY
            }
          ]
        : []),
      ...(therapyConfig.coiIdRequirement !== REQUIREMENT.NOT_REQUIRED
        ? [
            {
              id: 'patient-info-coiId',
              name: 'coiId',
              label: 'labels.coiId',
              placeholder: ' ',
              type: 'input',
              maxLength: 10,
              isRequired: therapyConfig.coiIdRequirement == REQUIREMENT.MANDATORY
            }
          ]
        : []),
      ...(therapyConfig.poNumberRequirement !== REQUIREMENT.NOT_REQUIRED
        ? [
            {
              id: 'patient-info-poNumber',
              name: 'poNumber',
              label: 'labels.providePONumber',
              placeholder: ' ',
              type: 'input',
              maxLength: 20,
              isRequired: therapyConfig.poNumberRequirement == REQUIREMENT.MANDATORY
            }
          ]
        : []),
      ...(therapyConfig.shipToPORequirement !== REQUIREMENT.NOT_REQUIRED
        ? [
            {
              id: 'patient-info-shipToPONumber',
              name: 'shipToPONumber',
              label: 'labels.shipToPONumber',
              placeholder: ' ',
              type: 'input',
              maxLength: 20,
              isRequired: therapyConfig.shipToPORequirement == REQUIREMENT.MANDATORY
            }
          ]
        : []),
      ...(therapyConfig.dateOfApheresisRequirement !== REQUIREMENT.NOT_REQUIRED
        ? [
            {
              id: 'patient-info-dateOfApheresis',
              name: 'dateOfApheresis',
              label: 'orderManagement.patientDetails.inputLabel.dateOfApheresis',
              placeholder: ' ',
              type: 'datePicker',
              isRequired: therapyConfig.dateOfApheresisRequirement == REQUIREMENT.MANDATORY
            }
          ]
        : [])
    ];
    const formattedControls = [
      {
        rows: controls.map((control, index) => ({
          grid: 'grid grid-gap-16 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 align-items-start',
          controls: [control]
        }))
      }
    ];

    return formattedControls;
  }
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
