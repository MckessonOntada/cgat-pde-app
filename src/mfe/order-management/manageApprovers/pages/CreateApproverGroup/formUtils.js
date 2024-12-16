import * as Yup from 'yup';
import { ALPHABETIC_WITH_SPECIAL } from '@src/components/form/ValidationRegExp';

export const transformAttributesToRules = (values, practiceId) => {
  const { name, approverUsers, rules } = values;

  // Initialize the result object
  const result = {
    name: name || 'default',
    practiceId: practiceId || 0,
    rules: {
      price: 0,
      accounts: [],
      therapies: [],
      roles: [],
      users: []
    },
    approverUsers: []
  };

  // Process rules
  rules.forEach((rule) => {
    switch (rule.attributeType) {
      case 'Price':
        result.rules.price = parseInt(rule.value, 10);
        break;
      case 'Catalog': // Therapies
        rule.value_augmented.forEach((therapy) => {
          result.rules.therapies.push({
            therapyId: therapy.value,
            therapyName: therapy.name
          });
        });
        break;
      case 'Account':
        rule.value_augmented.forEach((account) => {
          result.rules.accounts.push({
            accountId: account.value,
            accountName: account.name
          });
        });
        break;
      case 'User':
        rule.value_augmented.forEach((user) => {
          result.rules.users.push({
            userId: user.value,
            userName: user.name
          });
        });
        break;
      default:
        break;
    }
  });

  if (approverUsers) {
    approverUsers.forEach((userId) => {
      const userName =
        rules.find((rule) => rule.attributeType === 'User')?.value_augmented.find((user) => user.value === userId)?.name ||
        `User ${userId}`;

      result.approverUsers.push({
        userId,
        userName
      });
    });
  }

  return result;
};

export const getValidationSchema = (t) => {
  return Yup.object({
    name: Yup.string()
      .required(t('approvergroup.create.validation.approvergroupname_required'))
      .matches(ALPHABETIC_WITH_SPECIAL, t('approvergroup.create.validation.approvergroupname')) // Only alphabets
      .min(2, t('approvergroup.create.validation.approvergroupname_min_max'))
      .max(50, t('approvergroup.create.validation.approvergroupname_min_max')),
    rules: Yup.array()
      .of(
        Yup.object({
          attributeType: Yup.string()
            .required(t('approvergroup.create.validation.approverattribute_required'))
            .oneOf(['Price', 'Account', 'Catalog', 'User'], t('approvergroup.create.validation.approverattribute_required')),
          value: Yup.mixed()
            .required(t('approvergroup.create.validation.price_required'))
            .test('dynamic-validation', t('approvergroup.create.validation.price'), function (value) {
              const { attributeType } = this.parent;

              if (Array.isArray(value)) {
                if (value.length === 0) {
                  if (attributeType === 'Catalog') {
                    return this.createError({ message: t('approvergroup.create.validation.therapy_required') });
                  } else if (attributeType === 'Account') {
                    return this.createError({ message: t('approvergroup.create.validation.account_required') });
                  } else if (attributeType === 'User') {
                    return this.createError({ message: t('approvergroup.create.validation.user_required') });
                  }
                }
                return true;
              }
              if (attributeType === 'Price') {
                return Yup.number().min(0.001, t('approvergroup.create.validation.price')).isValidSync(value);
              }

              if (['Account', 'Catelog', 'User'].includes(attributeType)) {
                return value !== '';
              }

              return true;
            })
        })
      )
      .required('Required'),
    approverUsers: Yup.array()
      .required(t('approvergroup.create.validation.approveruser_required'))
      .min(1, t('approvergroup.create.validation.approveruser_required'))
  });
};
