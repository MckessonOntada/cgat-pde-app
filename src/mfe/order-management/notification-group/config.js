import AccountService from '@src/api/commonService/AccountService';
import MaterialService from '@src/api/commonService/MaterialService';
import NotificationService from '@src/api/commonService/NotificationService';
import CommonUtils from '@src/util/CommonUtils';

const ROUTE_PATH = {
  LIST: '',
  CREATE: 'create',
  VIEW: ':groupId',
  EDIT: ':groupId/edit'
};

const getUIConfig = (translateFn) => ({
  moduleTitle: {
    create: translateFn('userManagement.button.addNewGroup'),
    edit: translateFn('userManagement.button.editGroup')
  },
  metaSection: {
    title: translateFn('notificationGroup.groupDetails'),
    field: {
      id: 'group-name',
      name: 'groupName',
      label: translateFn('notificationGroup.notificationGroupName.label'),
      type: 'text',
      isRequired: true,
      helper: translateFn('notificationGroup.notificationGroupName.helperText')
    }
  },

  ruleSection: {
    title: translateFn('dynamicRuleGroup.rules'),
    attributes: [
      {
        name: 'notification-trigger',
        label: translateFn('notificationGroup.ruleNotificationTriggers.title'),
        isMandatory: true,
        joinBy: translateFn('dynamicRuleGroup.joinBy.anyOf'),
        helperText: translateFn('notificationGroup.ruleNotificationTriggers.helperText'),
        targetField: {
          type: 'search',
          label: translateFn('notificationGroup.ruleNotificationTriggers.targetField.label'),
          isMultiSelect: true,
          pillsCount: 5,
          isPillsVisible: true,
          isRequired: true,
          noSelectedCountMessage: translateFn('notificationGroup.placeholder.selectNotificationTriggers'),
          helperText: translateFn('notificationGroup.ruleNotificationTriggers.targetField.helperText'),
          pillListerFn: (item) => ({ id: item.value, labelText: item.label }),
          searchFn: async (query) => {
            const params = {};
            if (query) {
              params.query = query;
            }
            const notificationTriggers = await NotificationService.getNotificationTriggers(params);

            const options = notificationTriggers.map((trigger) => ({
              label: trigger.displayName,
              labelDescription: trigger.description,
              value: trigger.type
            }));
            return options;
          }
        }
      },
      {
        name: 'account',
        label: translateFn('notificationGroup.ruleAccount.title'),
        joinBy: translateFn('dynamicRuleGroup.joinBy.selectAnyOf'),
        helperText: translateFn('notificationGroup.ruleAccount.helperText'),
        targetField: {
          type: 'search',
          label: translateFn('notificationGroup.ruleAccount.targetField.label'),
          helperText: translateFn('notificationGroup.ruleAccount.targetField.helperText'),
          isMultiSelect: true,
          pillsCount: 5,
          isPillsVisible: true,
          noSelectedCountMessage: translateFn('notificationGroup.placeholder.selectAccounts'),
          pillListerFn: (item) => ({ id: item.value, labelText: item.label }),
          searchFn: async (query) => {
            const params = {};
            if (query) {
              params.query = query;
            }
            const accounts = await AccountService.getAllAccounts(params);

            const options = accounts.content.map((account) => ({
              label: account.accountName,
              labelDescription: account.accountNumber,
              value: account.accountNumber,
              accountId: account.accountNumber,
              accountName: account.accountName,
              channelType: account.channelType
            }));
            return options;
          }
        }
      },
      {
        name: 'material',
        label: translateFn('notificationGroup.ruleMaterial.title'),
        joinBy: translateFn('dynamicRuleGroup.joinBy.orderedAnyOf'),
        helperText: translateFn('notificationGroup.ruleMaterial.helperText'),
        targetField: {
          type: 'search',
          label: translateFn('notificationGroup.ruleMaterial.targetField.label'),
          isMultiSelect: true,
          pillsCount: 5,
          isPillsVisible: true,
          noSelectedCountMessage: translateFn('notificationGroup.placeholder.selectMaterials'),
          helperText: translateFn('notificationGroup.ruleMaterial.targetField.helperText'),
          pillListerFn: (item) => ({ id: item.value, labelText: item.label }),
          searchFn: async (query) => {
            const params = {};
            if (query) {
              params.query = query;
            }
            const materials = await MaterialService.getTherapies(params);
            const options = materials.content?.map((trade) => ({
              label: trade.tradeName,
              value: trade.tradeName,
              channelType: trade.channelType
            }));
            return options;
          }
        }
      },
      {
        name: 'price',
        label: translateFn('notificationGroup.rulePrice.title'),
        joinBy: translateFn('dynamicRuleGroup.joinBy.greaterThan'),
        helperText: translateFn('notificationGroup.rulePrice.helperText'),
        targetField: {
          type: 'number',
          length: 12,
          label: translateFn('notificationGroup.rulePrice.targetField.label'),
          helperText: translateFn('notificationGroup.rulePrice.targetField.helperText')
        }
      }
    ]
  },

  participantsSection: {
    title: translateFn('notificationGroup.participantsSection.title'),
    field: {
      id: 'participants',
      name: 'participants',
      label: translateFn('notificationGroup.participantsSection.label'),
      type: 'search',
      placeholder: translateFn('notificationGroup.participantsSection.placeholder'),
      isMultiSelect: true,
      isRequired: true,
      pillsCount: 5,
      isPillsVisible: true,
      // helperText: translateFn('notificationGroup.participantsSection.helperText'),
      pillListerFn: (item) => ({ id: item.value, labelText: item.label }),
      searchFn: async (query) => {
        const params = {
          userType: 'GENERAL',
          status: 'active'
        };
        if (query) {
          params.query = query;
        }
        const users = await MaterialService.getUsers(params);
        const options = users.content?.map((user) => ({
          label: CommonUtils.getUSFullName(user.name),
          value: user.id,
          email: user.contact.email,
          phoneNumber: user.contact.phone
        }));
        return options;
      }
    }
  }
});

export default getUIConfig;
export { ROUTE_PATH };
