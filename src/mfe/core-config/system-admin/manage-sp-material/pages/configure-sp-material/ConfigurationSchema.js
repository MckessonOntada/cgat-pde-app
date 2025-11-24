import * as Yup from 'yup';

export const getConfigurationSchema = (t, channelOptions, fieldNameForChannel, isBnbMaterial) =>
  Yup.object({
    [fieldNameForChannel]: Yup.string()
      .oneOf(channelOptions.map((opt) => opt.value))
      .required(
        isBnbMaterial
          ? t('manageSPMaterial.configuration.validation.patientInformationRequired')
          : t('manageSPMaterial.configuration.validation.triageChannelRequired')
      ),
    fields: Yup.array().of(
      Yup.object({
        fieldName: Yup.string().required(),
        displayOnForm: Yup.boolean(),
        mandatoryField: Yup.boolean(),
        showHelpIcon: Yup.boolean(),
        displayName: Yup.string().when('displayOnForm', {
          is: true,
          then: (schema) =>
            schema.when('mandatoryField', {
              is: true,
              then: (s) => s.required(t('manageSPMaterial.configuration.validation.displayNameRequiredMandatory')),
              otherwise: (s) => s.required(t('manageSPMaterial.configuration.validation.displayNameRequired'))
            }),
          otherwise: (schema) => schema.notRequired().nullable()
        }),
        errorMessage: Yup.string().when('displayOnForm', {
          is: true,
          then: (s) => s.required(t('manageSPMaterial.configuration.validation.errorMessageRequired')),
          otherwise: (s) => s.notRequired().nullable()
        }),
        helpInfoMessage: Yup.string().when(['displayOnForm', 'showHelpIcon'], {
          is: (displayOnForm, showHelpIcon) => displayOnForm === true && showHelpIcon === true,
          then: (s) => s.required(t('manageSPMaterial.configuration.validation.helpInfoRequired')),
          otherwise: (s) => s.notRequired().nullable()
        }),
        fieldFormat: Yup.object({
          formatType: Yup.string().when('displayOnForm', {
            is: true,
            then: (s) => s.required(t('manageSPMaterial.configuration.validation.formatTypeRequired')),
            otherwise: (s) => s.notRequired().nullable()
          }),
          validationRegex: Yup.string().when('displayOnForm', {
            is: true,
            then: (s) => s.required(t('manageSPMaterial.configuration.validation.regexRequired')),
            otherwise: (s) => s.notRequired().nullable()
          })
        })
      })
    )
  });
