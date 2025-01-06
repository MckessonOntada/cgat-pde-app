import * as Yup from 'yup';
import { ALPHA_NUMERIC_WITH_SPECIAL, ALPHABETIC_WITH_SPECIAL } from '@src/components/form/ValidationRegExp';
import { RuleKeys, RuleLabels } from '../ApproverGroupDetail/RulesConfig';

export const transformAttributesToRules = (values, practiceId) => {
  const { name, approverUsers, approverUsers_augmented, rules } = values;

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
      case RuleLabels[RuleKeys.PRICE]:
        result.rules.price = parseInt(rule.value, 10);
        break;
      case RuleLabels[RuleKeys.THERAPIES]: // Therapies
        rule.value_augmented.forEach((therapy) => {
          result.rules.therapies.push({
            therapyId: therapy.value,
            therapyName: therapy.name
          });
        });
        break;
      case RuleLabels[RuleKeys.ACCOUNTS]:
        rule.value_augmented.forEach((account) => {
          result.rules.accounts.push({
            accountId: account.value,
            accountName: account.name
          });
        });
        break;
      case RuleLabels[RuleKeys.USERS]:
        if (values.attributeuseroption == 'user_role') {
          rule.value_augmented.forEach((role) => {
            result.rules.roles.push({
              roleId: role.value,
              roleName: role.name
            });
          });
        } else {
          rule.value_augmented.forEach((user) => {
            result.rules.users.push({
              userId: user.value,
              userName: user.name
            });
          });
        }
        break;

      default:
        break;
    }
  });

  if (approverUsers) {
    approverUsers.forEach((userId) => {
      const userName = approverUsers_augmented.find((user) => user.value === userId)?.name || `User ${userId}`;

      result.approverUsers.push({
        userId,
        userName
      });
    });
  }
  Object.keys(result.rules).map((item) => {
    result.rules[item] = result.rules[item] === 0 || result.rules[item].length === 0 ? null : result.rules[item];
  });
  return result;
};

export const getValidationSchema = (t) => {
  return Yup.object({
    name: Yup.string()
      .required(t('approvergroup.create.validation.approvergroupname_required'))
      .matches(ALPHA_NUMERIC_WITH_SPECIAL, t('approvergroup.create.validation.approvergroupname')) // Only alphabets
      .min(2, t('approvergroup.create.validation.approvergroupname_min_max'))
      .max(50, t('approvergroup.create.validation.approvergroupname_min_max')),
    rules: Yup.array()
      .of(
        Yup.object({
          attributeType: Yup.string()
            .required(t('approvergroup.create.validation.approverattribute_required'))
            .oneOf(
              [RuleLabels[RuleKeys.PRICE], RuleLabels[RuleKeys.ACCOUNTS], RuleLabels[RuleKeys.THERAPIES], RuleLabels[RuleKeys.USERS]],
              t('approvergroup.create.validation.approverattribute_required')
            ),
          value: Yup.mixed()
            .required(t('approvergroup.create.validation.price_required'))
            .test('dynamic-validation', t('approvergroup.create.validation.price'), function (value) {
              const { attributeType } = this.parent;

              if (Array.isArray(value)) {
                if (value.length === 0) {
                  if (attributeType === RuleLabels[RuleKeys.THERAPIES]) {
                    return this.createError({ message: t('approvergroup.create.validation.therapy_required') });
                  } else if (attributeType === RuleLabels[RuleKeys.ACCOUNTS]) {
                    return this.createError({ message: t('approvergroup.create.validation.account_required') });
                  } else if (attributeType === RuleLabels[RuleKeys.USERS]) {
                    return this.createError({ message: t('approvergroup.create.validation.user_required') });
                  }
                }
                return true;
              }
              if (attributeType === RuleLabels[RuleKeys.PRICE]) {
                return Yup.number().min(0.001, t('approvergroup.create.validation.price')).isValidSync(value);
              }

              if ([RuleLabels[RuleKeys.ACCOUNTS], RuleLabels[RuleKeys.THERAPIES], RuleLabels[RuleKeys.USERS]].includes(attributeType)) {
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

export const createLabelData = (values = []) => {
  if (!Array.isArray(values)) {
    return [];
  }

  return values.map(({ name, value }) => ({
    labelText: name,
    id: value
  }));
};
