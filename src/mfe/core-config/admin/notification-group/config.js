import MaterialService from '@src/api/commonService/MaterialService';
import CommonUtils from '@src/util/CommonUtils';

const ROUTE_PATH = {
  LIST: '',
  CREATE: 'create',
  VIEW: ':groupId',
  EDIT: ':groupId/edit'
};

const NotificationTriggers = [
  {
    label: 'User Access Awaiting Review',
    description: 'Triggered when a new user access request is pending admin approval.'
  },
  {
    label: 'Delegate Login Recorded',
    description: 'Captures login activity when a user accesses the system on behalf of another.'
  },
  {
    label: 'Order Auto-Approved Successfully',
    description: 'Notification when an order is automatically approved after submission.'
  },
  {
    label: 'Order Awaiting Review',
    description: 'Sent when an order requires manual review and approval.'
  },
  {
    label: 'Order Approved Successfully',
    description: 'Confirmation notification once the order has been approved.'
  },
  {
    label: 'Order Request Rejected',
    description: 'Informs the user that their order request has been rejected.'
  },
  {
    label: 'Orders Waiting Physician Review',
    description: 'Displays orders queued for physician review before approval.'
  },
  {
    label: 'Therapy Selection Confirmed',
    description: 'Confirmation that therapy selection for the order is completed.'
  },
  {
    label: 'Account Confirmed – Buy & Bill',
    description: 'Indicates account confirmation for Buy & Bill orders.'
  },
  {
    label: 'Account Confirmed – Specialty Pharmacy',
    description: 'Indicates account confirmation for Specialty Pharmacy orders.'
  },
  {
    label: 'Patient Information Confirmed',
    description: 'Confirms that all patient details have been entered and verified.'
  },
  {
    label: 'Additional Information Confirmed',
    description: 'Confirms that the additional details section has been completed.'
  },
  {
    label: 'Account Step Completed',
    description: 'Notification confirming completion of the account selection step.'
  },
  {
    label: 'Patient Info Updated – Buy & Bill',
    description: 'Indicates that patient details for Buy & Bill orders have been updated.'
  },
  {
    label: 'Patient Info Updated – SP',
    description: 'Indicates that patient details for Specialty Pharmacy orders have been updated.'
  },
  {
    label: 'Additional Info Updated',
    description: 'Confirms that additional order information has been successfully updated.'
  },
  {
    label: 'Order Successfully Submitted',
    description: 'Confirmation that the order has been submitted successfully.'
  }
];

const config = {
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

export default config;
export { ROUTE_PATH };
