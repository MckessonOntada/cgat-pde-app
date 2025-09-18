const notificationConfig = {
  moduleName: 'notificationPreferences.moduleName',
  options: ['notificationPreferences.optionEmail', 'notificationPreferences.optionInApp', 'notificationPreferences.optionSMS'],
  sections: [
    {
      title: 'notificationPreferences.userManagement.title',
      id: 'userManagement',
      rows: [
        {
          title: 'notificationPreferences.userManagement.processUpdate.title',
          subtitle: 'notificationPreferences.userManagement.processUpdate.subtitle',
          id: 'processUpdate',
          isPreferred: true,
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
          id: 'reminders',
          isPreferred: false,
          optionValues: [
            {
              tooltip: 'notificationPreferences.userManagement.reminders.tooltip',
              value: true
            },
            {
              tooltip: 'notificationPreferences.userManagement.reminders.tooltip',
              value: true
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
      id: 'orderManagement',
      rows: [
        {
          title: 'notificationPreferences.orderManagement.processUpdate.title',
          subtitle: 'notificationPreferences.orderManagement.processUpdate.subtitle',
          id: 'processUpdate',
          isPreferred: false,
          optionValues: [
            {
              tooltip: 'notificationPreferences.orderManagement.processUpdate.tooltip',
              value: true
            },
            {
              tooltip: 'notificationPreferences.orderManagement.processUpdate.tooltip',
              value: true
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
          id: 'reminders',
          isPreferred: false,
          optionValues: [
            {
              tooltip: 'notificationPreferences.orderManagement.reminders.tooltip',
              value: true
            },
            {
              tooltip: 'notificationPreferences.orderManagement.reminders.tooltip',
              value: true
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
      id: 'orderApproval',
      rows: [
        {
          title: 'notificationPreferences.orderApproval.processUpdate.title',
          subtitle: 'notificationPreferences.orderApproval.processUpdate.subtitle',
          id: 'processUpdate',
          isPreferred: false,
          optionValues: [
            {
              tooltip: 'notificationPreferences.orderApproval.processUpdate.tooltip',
              value: true
            },
            {
              tooltip: 'notificationPreferences.orderApproval.processUpdate.tooltip',
              value: true
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
          id: 'reminders',
          isPreferred: false,
          optionValues: [
            {
              tooltip: 'notificationPreferences.orderApproval.reminders.tooltip',
              value: true
            },
            {
              tooltip: 'notificationPreferences.orderApproval.reminders.tooltip',
              value: true
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
      id: 'onBehalfOf',
      subtitle: 'notificationPreferences.onBehalfOf.subtitle',
      optionValues: [
        {
          tooltip: 'notificationPreferences.onBehalfOf.tooltip',
          value: true
        },
        {
          tooltip: 'notificationPreferences.onBehalfOf.tooltip',
          value: true
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
