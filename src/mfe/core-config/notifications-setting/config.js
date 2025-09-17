const notificationConfig = {
  moduleName: 'Manage Email, SMS & In-app Notifications',
  options: ['email', 'in-app', 'sms'],
  sections: [
    {
      title: 'User Management',
      rows: [
        {
          title: 'Process Update',
          subtitle: 'Get notified when a new user is created.',
          optionValues: [
            {
              tooltip: "You can't modify this. Contact your Organization Admin if you want to make any changes to it.",
              value: false
            },
            {
              tooltip: 'option tooltip',
              value: false
            },
            {
              tooltip: 'option tooltip',
              value: false
            }
          ]
        },
        {
          title: 'Reminders',
          subtitle: 'Receive reminders about pending user setup.',
          optionValues: [
            {
              tooltip: 'option tooltip',
              value: true
            },
            {
              tooltip: 'option tooltip',
              value: true
            },
            {
              tooltip: 'option tooltip',
              value: false
            }
          ]
        }
      ]
    },
    {
      title: 'Order Management',
      rows: [
        {
          title: 'Process Update',
          subtitle: 'Stay informed on perscription or order placement and modification',
          optionValues: [
            {
              tooltip: 'option tooltip',
              value: true
            },
            {
              tooltip: 'option tooltip',
              value: true
            },
            {
              tooltip: 'option tooltip',
              value: false
            }
          ]
        },
        {
          title: 'Reminders',
          subtitle: 'Receive reminders about pending prescription or order or unprocessed updates.',
          optionValues: [
            {
              tooltip: 'option tooltip',
              value: true
            },
            {
              tooltip: 'option tooltip',
              value: true
            },
            {
              tooltip: 'option tooltip',
              value: false
            }
          ]
        }
      ]
    },
    {
      title: 'Order Approval',
      rows: [
        {
          title: 'Process Update',
          subtitle: 'Get notified when an order requires your review, approval or rejection.',
          optionValues: [
            {
              tooltip: 'option tooltip',
              value: true
            },
            {
              tooltip: 'option tooltip',
              value: true
            },
            {
              tooltip: 'option tooltip',
              value: false
            }
          ]
        },
        {
          title: 'Reminders',
          subtitle: 'Receive reminders about pending prescription or order or unprocessed updates.',
          optionValues: [
            {
              tooltip: 'option tooltip',
              value: true
            },
            {
              tooltip: 'option tooltip',
              value: true
            },
            {
              tooltip: 'option tooltip',
              value: false
            }
          ]
        }
      ]
    },
    {
      title: 'On Behalf of',
      subtitle: 'Get notified when another user submits or manages a prescription or order on behalf of you.',
      optionValues: [
        {
          tooltip: 'option tooltip',
          value: true
        },
        {
          tooltip: 'option tooltip',
          value: true
        },
        {
          tooltip: 'option tooltip',
          value: false
        }
      ]
    }
  ]
};

export default notificationConfig;
