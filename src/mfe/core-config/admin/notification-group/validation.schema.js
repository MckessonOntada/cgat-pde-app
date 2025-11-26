import * as Yup from 'yup';

export const NotificationGroupSchema = Yup.object({
  groupName: Yup.string().trim().required('Group name is required'),

  rules: Yup.array()
    .of(
      Yup.object({
        attribute: Yup.string().required('Attribute is required'),
        value: Yup.mixed()
          .required('Value is required')
          .test('not-empty', 'Value is required', (v) => {
            if (v === undefined || v === null) return false;

            if (typeof v === 'string') return v.trim() !== '';

            if (Array.isArray(v)) return v.length > 0;

            return true;
          })
      })
    )
    .min(1, 'At least one rule is required'),

  participants: Yup.array().of(Yup.object()).min(1, 'Select at least one participant')
});
