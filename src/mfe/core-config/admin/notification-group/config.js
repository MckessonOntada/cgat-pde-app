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

const config = {
  moduleTitle: 'Add New Group',
  metaSection: {
    title: 'Group Details',
    field: {
      id: 'group-name',
      name: 'groupName',
      label: 'Notification Group Name',
      type: 'text',
      isRequired: true,
      helper: 'Please enter a unique notification group name.'
    }
  },

  ruleSection: {
    title: 'Rules',
    attributes: [
      {
        name: 'notification-trigger',
        label: 'Notification Triggers',
        isMandatory: true,
        joinBy: 'Any Of',
        helperText: 'Please select a criteria to apply the notification rules on.',
        targetField: {
          type: 'search',
          label: 'Select Notification(s)',
          isMultiSelect: true,
          pillsCount: 5,
          isPillsVisible: true,
          helperText: 'Please select the therapy(s) for the notification group.',
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
        label: 'Account',
        joinBy: 'Selected Any Of',
        helperText: 'Please select a criteria to apply the notification rules on.',
        targetField: {
          type: 'search',
          label: 'Select account',
          helperText: 'Please select account for the notification group.',
          isMultiSelect: true,
          pillsCount: 5,
          isPillsVisible: true,
          pillListerFn: (item) => ({ id: item.value, labelText: item.label }),
          searchFn: async (query) => {
            const params = {};
            if (query) {
              params.query = query;
            }
            const accounts = await AccountService.getAllAccounts(params);
            debugger;

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
        label: 'Material',
        joinBy: 'Ordered Any Of',
        helperText: 'Please select a criteria to apply the notification rules on.',
        targetField: {
          type: 'search',
          label: 'Select Therapy',
          isMultiSelect: true,
          pillsCount: 5,
          isPillsVisible: true,
          helperText: 'Please select the therapy(s) for the notification group.',
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
        label: 'Price',
        joinBy: 'Greater than',
        helperText: 'Please select a criteria to apply the notification rules on.',
        targetField: {
          type: 'number',
          label: 'Amount',
          helperText: 'Please enter the amount greater than for the notification group.'
        }
      }
    ]
  },

  participantsSection: {
    title: 'Notification user list',
    field: {
      id: 'participants',
      name: 'participants',
      label: 'Participants',
      type: 'search',
      placeholder: 'Search participants',
      isMultiSelect: true,
      isRequired: true,
      pillsCount: 5,
      isPillsVisible: true,
      helperText: 'Select the users who will receive notifications for the selected triggers.',
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
};

export default config;
export { ROUTE_PATH };
