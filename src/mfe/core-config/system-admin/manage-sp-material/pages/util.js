import { ALPHA_NUMERIC, ALPHABETIC_WITH_SPACE, ALPHA_NUMERIC_WITH_SPECIAL, NUMBER_REGEX } from '@src/components/form/ValidationRegExp';
import * as Yup from 'yup';

export const initialValuesforConfiguration = {
  patientIdentifierRequired: '',
  coiIdRequired: '',
  mrnRequired: ''
};

export const initialValuesforPrescription = {
  prescriptionDetailsRequired: 'yes',
  quantity: '',
  daysSupply: '',
  refills: '',
  instructions: ''
};

export const validationSchemaforPrescription = (t) =>
  Yup.object({
    quantity: Yup.string()
      .required(t('manageMaterial.drawer.details.configuration.body.quantityRequired'))
      .matches(NUMBER_REGEX, `${t('labels.quantity')} ${t('manageMaterial.drawer.details.configuration.body.numericValidation')}`)
      .test('min-quantity', `${t('labels.quantity')} ${t('manageMaterial.drawer.details.configuration.body.minValidation')}`, (val) => parseInt(val, 10) > 0),

    daysSupply: Yup.string()
      .required(t('manageMaterial.drawer.details.configuration.body.daysSupplyRequired'))
      .matches(NUMBER_REGEX, `${t('labels.daysSupply')}  ${t('manageMaterial.drawer.details.configuration.body.numericValidation')}`)
      .test(
        'min-daysSupply',
        `${t('labels.daysSupply')} ${t('manageMaterial.drawer.details.configuration.body.minValidation')}`,
        (val) => parseInt(val, 10) > 0
      ),

    refills: Yup.string()
      .required(t('manageMaterial.drawer.details.configuration.body.refillsRequired'))
      .matches(NUMBER_REGEX, `${t('labels.refills')}  ${t('manageMaterial.drawer.details.configuration.body.numericValidation')}`)
      .test('min-refills', t('manageMaterial.drawer.details.configuration.body.refillsMinValidation'), (val) => parseInt(val, 10) >= 0),

    instructions: Yup.string().required(t('manageMaterial.drawer.details.configuration.body.instructionsRequired'))
  });

export const validationSchemaforConfiguration = (t) =>
  Yup.object({
    patientIdentifierRequired: Yup.string().required(t('manageMaterial.drawer.details.configuration.body.patientIdentifierRequired')),
    coiIdRequired: Yup.string().required(t('manageMaterial.drawer.details.configuration.body.coiIdRequired')),
    mrnRequired: Yup.string().required(t('manageMaterial.drawer.details.configuration.body.mrnRequired'))
  });
