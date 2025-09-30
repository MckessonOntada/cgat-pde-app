const notificationConfig = {
  moduleName: 'notificationPreferences.moduleName',
  options: ['notificationPreferences.optionEmail', 'notificationPreferences.optionInApp', 'notificationPreferences.optionSMS'],
  sections: [
    {
      title: 'notificationPreferences.userManagement.title',
      id: 'USER_MANAGEMENT',
      rows: [
        {
          title: 'notificationPreferences.userManagement.processUpdate.title',
          subtitle: 'notificationPreferences.userManagement.processUpdate.subtitle',
          id: 'PROCESS_UPDATES',
          optionValues: [
            {
              tooltip: 'notificationPreferences.userManagement.processUpdate.tooltip.locked',
              value: false
            },
            {
              tooltip: 'notificationPreferences.userManagement.processUpdate.tooltip',
              value: false
            },
            {
              tooltip: 'notificationPreferences.userManagement.processUpdate.tooltip',
              value: false
            }
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
              tooltip: 'notificationPreferences.userManagement.reminders.tooltip',
              value: false
            },
            {
              tooltip: 'notificationPreferences.userManagement.reminders.tooltip',
              value: false
            }
          ]
        }
      ]
    },
    {
      title: 'notificationPreferences.orderManagement.title',
      id: 'ORDER_MANAGEMENT',
      rows: [
        {
          title: 'notificationPreferences.orderManagement.processUpdate.title',
          subtitle: 'notificationPreferences.orderManagement.processUpdate.subtitle',
          id: 'PROCESS_UPDATES',
          optionValues: [
            {
              tooltip: 'notificationPreferences.orderManagement.processUpdate.tooltip',
              value: false
            },
            {
              tooltip: 'notificationPreferences.orderManagement.processUpdate.tooltip',
              value: false
            },
            {
              tooltip: 'notificationPreferences.orderManagement.processUpdate.tooltip',
              value: false
            }
          ]
        },
        {
          title: 'notificationPreferences.orderManagement.reminders.title',
          subtitle: 'notificationPreferences.orderManagement.reminders.subtitle',
          id: 'REMINDERS',
          optionValues: [
            {
              tooltip: 'notificationPreferences.orderManagement.reminders.tooltip',
              value: false
            },
            {
              tooltip: 'notificationPreferences.orderManagement.reminders.tooltip',
              value: false
            },
            {
              tooltip: 'notificationPreferences.orderManagement.reminders.tooltip',
              value: false
            }
          ]
        }
      ]
    },
    {
      title: 'notificationPreferences.orderApproval.title',
      id: 'ORDER_APPROVAL',
      rows: [
        {
          title: 'notificationPreferences.orderApproval.processUpdate.title',
          subtitle: 'notificationPreferences.orderApproval.processUpdate.subtitle',
          id: 'PROCESS_UPDATES',
          optionValues: [
            {
              tooltip: 'notificationPreferences.orderApproval.processUpdate.tooltip',
              value: false
            },
            {
              tooltip: 'notificationPreferences.orderApproval.processUpdate.tooltip',
              value: false
            },
            {
              tooltip: 'notificationPreferences.orderApproval.processUpdate.tooltip',
              value: false
            }
          ]
        },
        {
          title: 'notificationPreferences.orderApproval.reminders.title',
          subtitle: 'notificationPreferences.orderApproval.reminders.subtitle',
          id: 'REMINDERS',
          optionValues: [
            {
              tooltip: 'notificationPreferences.orderApproval.reminders.tooltip',
              value: false
            },
            {
              tooltip: 'notificationPreferences.orderApproval.reminders.tooltip',
              value: false
            },
            {
              tooltip: 'notificationPreferences.orderApproval.reminders.tooltip',
              value: false
            }
          ]
        }
      ]
    },
    {
      title: 'notificationPreferences.onBehalfOf.title',
      id: 'ON_BEHALF_OF',
      subtitle: 'notificationPreferences.onBehalfOf.subtitle',
      optionValues: [
        {
          tooltip: 'notificationPreferences.onBehalfOf.tooltip',
          value: false
        },
        {
          tooltip: 'notificationPreferences.onBehalfOf.tooltip',
          value: false
        },
        {
          tooltip: 'notificationPreferences.onBehalfOf.tooltip',
          value: false
        }
      ]
    }
  ]
};

export default notificationConfig;
