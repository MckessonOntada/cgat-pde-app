import * as Yup from 'yup';

export const getNotificationGroupSchema = (translateFn) =>
  Yup.object({
    groupName: Yup.string().trim().required(translateFn('notificationGroup.validation.groupNameIsRequired')),

    rules: Yup.array()
      .of(
        Yup.object({
          attribute: Yup.string().required(translateFn('notificationGroup.validation.attributeIsRequired')),
          value: Yup.mixed()
            .required(translateFn('notificationGroup.validation.valueIsRequired'))
            .test('not-empty', translateFn('notificationGroup.validation.valueIsRequired'), (v) => {
              if (v === undefined || v === null) return false;

              if (typeof v === 'string') return v.trim() !== '';

              if (Array.isArray(v)) return v.length > 0;

              return true;
            })
            .test('price-must-be-whole-number', translateFn('notificationGroup.validation.provideCorrectPrice'), function (value) {
              const { attribute } = this.parent;

              if (attribute !== 'price') return true;
              if (value === undefined || value === null) return false;

              return /^[0-9]+$/.test(String(value));
            })
        })
      )
      .min(1, translateFn('notificationGroup.validation.leastOneRuleRequired')),

    participants: Yup.array().of(Yup.object()).min(1, translateFn('notificationGroup.validation.leastOneParticipantRequired'))
  });
