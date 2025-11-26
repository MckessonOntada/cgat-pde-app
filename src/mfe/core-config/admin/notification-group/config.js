import MaterialService from '@src/api/commonService/MaterialService';
import CommonUtils from '@src/util/CommonUtils';
import NotificationTriggers from './notification-triggers';

export default {
  moduleTitle: 'Notification Group',
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

            const options = NotificationTriggers?.map((trigger) => ({
              label: trigger.label,
              labelDescription: trigger.description,
              value: trigger.label
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
          searchUrl: '/api/users',
          helperText: 'Please select account for the notification group.'
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
              value: trade.tradeName
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
          value: user.id
        }));
        return options;
      }
    }
  }
};
