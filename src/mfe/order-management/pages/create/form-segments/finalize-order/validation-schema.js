import { ALPHABETIC_WITH_SPECIAL_AND_ACCENTED, NUMBER_REGEX } from '@src/components/form/ValidationRegExp';
import CommonUtils from '@src/util/CommonUtils';
import * as Yup from 'yup';

export const getPrescriptionAndSignatureSchema = (t) =>
  Yup.object().shape({
    quantity: Yup.string()
      .required(t('labels.validationMessages.quantityRequired'))
      .matches(NUMBER_REGEX, `${t('labels.quantity')} ${t('manageMaterial.drawer.details.configuration.body.numericValidation')}`)
      .test('min-quantity', `${t('labels.quantity')} ${t('manageMaterial.drawer.details.configuration.body.minValidation')}`, (val) => parseInt(val, 10) > 0),

    daysSupply: Yup.string()
      .required(t('labels.validationMessages.daySupplyRequired'))
      .matches(NUMBER_REGEX, `${t('labels.daysSupply')} ${t('manageMaterial.drawer.details.configuration.body.numericValidation')}`)
      .test(
        'min-daysSupply',
        `${t('labels.daysSupply')} ${t('manageMaterial.drawer.details.configuration.body.minValidation')}`,
        (val) => parseInt(val, 10) > 0
      ),

    refills: Yup.string()
      .required(t('labels.validationMessages.refillsRequired'))
      .matches(NUMBER_REGEX, `${t('labels.refills')} ${t('manageMaterial.drawer.details.configuration.body.numericValidation')}`)
      .test('min-refills', t('manageMaterial.drawer.details.configuration.body.refillsMinValidation'), (val) => parseInt(val, 10) >= 0),

    instructions: Yup.string().required(t('labels.validationMessages.instructionsRequired')),
    prescriberName: Yup.string()
      .required(t('labels.validationMessages.signedBy'))
      .matches(ALPHABETIC_WITH_SPECIAL_AND_ACCENTED, t('labels.validationMessages.signedBy_invalid')),
    reviewConsent: Yup.boolean().oneOf([true], t('labels.validation.consent')).required(t('labels.validation.consent'))
  });

export const getPrescriptionAndSignatureInitialValues = {
  drugName: '',
  drugForm: '',
  strength: '',
  quantity: '',
  refills: '',
  daysSupply: '',
  instructions: '',
  prescriberName: '',
  reviewConsent: false
};
