import * as Yup from 'yup';

export const getConfigurationSchema = (t, channelOptions, fieldNameForChannel, isBnbMaterial) =>
  Yup.object({
    [fieldNameForChannel]: isBnbMaterial
      ? Yup.boolean().oneOf([true, false]).required(t('manageSPMaterial.configuration.validation.patientInformationRequired'))
      : Yup.string()
          .oneOf(channelOptions.map((opt) => opt.value))
          .required(t('manageSPMaterial.configuration.validation.triageChannelRequired')),
    fields: Yup.array().of(
      Yup.object({
        fieldName: Yup.string().required(),
        properties: Yup.object({
          displayOnForm: Yup.boolean(),
          mandatoryField: Yup.boolean(),
          showHelpIcon: Yup.boolean(),
          displayName: Yup.string().when('displayOnForm', {
            is: true,
            then: (schema) =>
              schema
                .max(
                  30,
                  t('manageSPMaterial.configuration.validation.displayNameMaxLength', {
                    max: 30
                  })
                )
                .when('mandatoryField', {
                  is: true,
                  then: (s) => s.required(t('manageSPMaterial.configuration.validation.displayNameRequiredMandatory')),
                  otherwise: (s) => s.required(t('manageSPMaterial.configuration.validation.displayNameRequired'))
                }),
            otherwise: (schema) => schema.notRequired().nullable()
          }),
          errorMessage: Yup.string().when('displayOnForm', {
            is: true,
            then: (s) =>
              s.required(t('manageSPMaterial.configuration.validation.errorMessageRequired')).max(
                100,
                t('manageSPMaterial.configuration.validation.errorMessageMaxLength', {
                  max: 100
                })
              ),
            otherwise: (s) => s.notRequired().nullable()
          }),
          helpInfoMessage: Yup.string().when(['displayOnForm', 'showHelpIcon'], {
            is: (displayOnForm, showHelpIcon) => displayOnForm && showHelpIcon,
            then: (s) =>
              s.required(t('manageSPMaterial.configuration.validation.helpInfoRequired')).max(
                100,
                t('manageSPMaterial.configuration.validation.helpInfoMaxLength', {
                  max: 100
                })
              ),
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
      })
    )
  });
