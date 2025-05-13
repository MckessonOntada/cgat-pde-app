import * as Yup from 'yup';
import { ALPHA_NUMERIC } from '@src/components/form/ValidationRegExp';
import { CONTROL_OPTIONS } from '../ApproverGroupDetail/RulesConfig';

export const transformAttributesToRules = (values, practiceId) => {
  const { name, approverUsers, approverUsers_augmented, rules, materials, accounts } = values;
  const result = {
    name: name.trim() || 'default',
    practiceId: practiceId || 0,
    rules: {},
    approverUsers: []
  };

  const getChannelType = (attributeType, value, name) => {
    const data = attributeType.find((item) => item.value === value && item.label === name);
    return data ? data.channelType : null;
  };

  rules.forEach((rule) => {
    switch (rule.attributeType) {
      case CONTROL_OPTIONS.Price:
        result.rules.price = parseInt(rule.value, 10);
        break;
      case CONTROL_OPTIONS.Material: // Therapies
        result.rules.therapies = rule.value_augmented.map((therapy) => ({
          therapyId: therapy.value,
          therapyName: therapy.name,
          channelType: getChannelType(materials, therapy.value, therapy.name)
        }));
        break;
      case CONTROL_OPTIONS.Account:
        result.rules.accounts = rule.value_augmented.map((account) => ({
          accountId: account.value,
          accountName: account.name,
          channelType: getChannelType(accounts, account.value, account.name)
        }));
        break;
      case CONTROL_OPTIONS['User Role']:
        result.rules.roles = rule.value_augmented.map((role) => ({
          roleId: role.value,
          roleName: role.name
        }));
        break;
      case CONTROL_OPTIONS['User Name']:
        result.rules.users = rule.value_augmented.map((user) => ({
          userId: user.value,
          userName: user.name
        }));
        break;
      default:
        break;
    }
  });

  if (approverUsers) {
    approverUsers.forEach((userId) => {
      const targetUser = approverUsers_augmented.find((user) => user.value === userId);
      const userName = targetUser?.label || `User ${userId}`;

      result.approverUsers.push({
        userId,
        userName,
        email: targetUser?.email
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
      .matches(ALPHA_NUMERIC, t('approvergroup.create.validation.approvergroupname')) // Only alphabets
      .min(2, t('approvergroup.create.validation.approvergroupname_min_max'))
      .max(50, t('approvergroup.create.validation.approvergroupname_min_max')),
    rules: Yup.array()
      .of(
        Yup.object({
          attributeType: Yup.string()
            .required(t('approvergroup.create.validation.approverattribute_required'))
            .oneOf(
              [
                CONTROL_OPTIONS.Price,
                CONTROL_OPTIONS.Account,
                CONTROL_OPTIONS.Material,
                CONTROL_OPTIONS['User Name'],
                CONTROL_OPTIONS['User Role']
              ],
              t('approvergroup.create.validation.approverattribute_required')
            ),
          value: Yup.mixed()
            .required(t('approvergroup.create.validation.price_required'))
            .test('dynamic-validation', t('approvergroup.create.validation.price'), function (value) {
              const { attributeType } = this.parent;

              if (Array.isArray(value)) {
                if (value.length === 0) {
                  if (attributeType === CONTROL_OPTIONS.Material) {
                    return this.createError({
                      message: t('approvergroup.create.validation.therapy_required')
                    });
                  } else if (attributeType === CONTROL_OPTIONS.Account) {
                    return this.createError({
                      message: t('approvergroup.create.validation.account_required')
                    });
                  } else if (attributeType === CONTROL_OPTIONS['User Role']) {
                    return this.createError({
                      message: t('approvergroup.create.validation.user_role_required')
                    });
                  } else if (attributeType === CONTROL_OPTIONS['User Name']) {
                    return this.createError({
                      message: t('approvergroup.create.validation.user_name_required')
                    });
                  }
                }
                return true;
              }
              if (attributeType === CONTROL_OPTIONS.Price) {
                return Yup.number().min(0.001, t('approvergroup.create.validation.price')).isValidSync(value);
              }

              if (
                [CONTROL_OPTIONS.Account, CONTROL_OPTIONS.Material, CONTROL_OPTIONS['User Name'], CONTROL_OPTIONS['User Role']].includes(
                  attributeType
                )
              ) {
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
