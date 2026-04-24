import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';

const notificationConfig = {
  moduleName: 'notificationPreferences.moduleName',
  options: [
    'notificationPreferences.optionEmail',
    'notificationPreferences.optionInApp'
    //  'notificationPreferences.optionSMS'
  ],
  sections: [
    {
      title: 'notificationPreferences.userManagement.title',
      id: 'USER_MANAGEMENT',
      permissions: [PERMISSIONS_ENUM.USER_MANAGEMENT.CREATE_USER_FOR_PENDING_USER_REQUEST],
      rows: [
        {
          title: 'notificationPreferences.userManagement.processUpdate.title',
          subtitle: 'notificationPreferences.userManagement.processUpdate.subtitle',
          id: 'PROCESS_UPDATES',
          optionValues: [
            {
              value: false
            },
            {
              value: false
            }
            // {
            //   value: false
            // }
          ]
        },
        {
          title: 'notificationPreferences.userManagement.reminders.title',
          subtitle: 'notificationPreferences.userManagement.reminders.subtitle',
          id: 'REMINDERS',
          optionValues: [
            {
              tooltip: 'notificationPreferences.userManagement.reminders.tooltip',
              value: false
            },
            {
              value: false
            }
            // {
            //   value: false
            // }
          ]
        }
      ]
    },
    {
      title: 'notificationPreferences.orderManagement.title',
      id: 'ORDER_MANAGEMENT',
      permissions: [...Object.values(PERMISSIONS_ENUM.CREATE_NEW_ORDER), PERMISSIONS_ENUM.ORDER_MANAGEMENT.REVIEW_ORDER],
      rows: [
        {
          title: 'notificationPreferences.orderManagement.processUpdate.title',
          subtitle: 'notificationPreferences.orderManagement.processUpdate.subtitle',
          id: 'PROCESS_UPDATES',
          optionValues: [
            {
              value: false
            },
            {
              value: false
            }
            // {
            //   value: false
            // }
          ]
        },
        {
          title: 'notificationPreferences.orderManagement.reminders.title',
          subtitle: 'notificationPreferences.orderManagement.reminders.subtitle',
          id: 'REMINDERS',
          optionValues: [
            {
              value: false
            },
            {
              value: false
            }
            // {
            //   value: false
            // }
          ]
        }
      ]
    },
    {
      title: 'notificationPreferences.orderApproval.title',
      id: 'ORDER_APPROVAL',
      permissions: [PERMISSIONS_ENUM.ORDER_MANAGEMENT.APPROVE_ORDERS, PERMISSIONS_ENUM.ORDER_MANAGEMENT.REJECT_ORDER],
      rows: [
        {
          title: 'notificationPreferences.orderApproval.processUpdate.title',
          subtitle: 'notificationPreferences.orderApproval.processUpdate.subtitle',
          id: 'PROCESS_UPDATES',
          optionValues: [
            {
              value: false
            },
            {
              value: false
            }
            // {
            //   value: false
            // }
          ]
        },
        {
          title: 'notificationPreferences.orderApproval.reminders.title',
          subtitle: 'notificationPreferences.orderApproval.reminders.subtitle',
          id: 'REMINDERS',
          optionValues: [
            {
              value: false
            },
            {
              value: false
            }
            // {
            //   value: false
            // }
          ]
        }
      ]
    },
    {
      title: 'notificationPreferences.onBehalfOf.title',
      id: 'ON_BEHALF_OF',
      permissions: PERMISSIONS_ENUM.USER_MANAGEMENT.ON_BEHALF_OF_USER,
      subtitle: 'notificationPreferences.onBehalfOf.subtitle',
      optionValues: [
        {
          value: false
        },
        {
          value: false
        }
        // {
        //   value: false
        // }
      ]
    }
  ]
};

export default notificationConfig;
