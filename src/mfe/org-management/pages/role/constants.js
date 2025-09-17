export const INITIAL_PREFERENCES = {
  userManagement: {
    processUpdates: { setPreference: false, email: false, inApp: false, sms: false },
    reminders: { setPreference: false, email: false, inApp: false, sms: false }
  },
  orderManagement: {
    processUpdates: { setPreference: false, email: false, inApp: false, sms: false },
    reminders: { setPreference: false, email: false, inApp: false, sms: false }
  },
  orderApproval: {
    processUpdates: { setPreference: false, email: false, inApp: false, sms: false },
    reminders: { setPreference: false, email: false, inApp: false, sms: false }
  },
  onBehalfOf: {
    onBehalfOf: { setPreference: false, email: false, inApp: false, sms: false }
  }
};

export const COMMUNICATION_PREFERENCES = [
  {
    sectionKey: 'userManagement',
    sectionTitle: 'User Management',
    items: [
      {
        itemKey: 'processUpdates',
        itemTitle: 'Process Updates',
        itemDescription: 'Get notified when a new user is created.',
        switches: [
          { field: 'setPreference', disabledIf: null },
          { field: 'email', disabledIf: 'setPreference' },
          { field: 'inApp', disabledIf: 'setPreference' },
          { field: 'sms', disabledIf: 'setPreference' }
        ]
      },
      {
        itemKey: 'reminders',
        itemTitle: 'Reminders',
        itemDescription: 'Receive reminders about pending user setup.',
        switches: [
          { field: 'setPreference', disabledIf: null },
          { field: 'email', disabledIf: 'setPreference' },
          { field: 'inApp', disabledIf: 'setPreference' },
          { field: 'sms', disabledIf: 'setPreference' }
        ]
      }
    ]
  },
  {
    sectionKey: 'orderManagement',
    sectionTitle: 'Order Management',
    items: [
      {
        itemKey: 'processUpdates',
        itemTitle: 'Process Updates',
        itemDescription: 'Stay informed on prescription or order placements & modifications.',
        switches: [
          { field: 'setPreference', disabledIf: null },
          { field: 'email', disabledIf: 'setPreference' },
          { field: 'inApp', disabledIf: 'setPreference' },
          { field: 'sms', disabledIf: 'setPreference' }
        ]
      },
      {
        itemKey: 'reminders',
        itemTitle: 'Reminders',
        itemDescription: 'Receive reminders about pending prescription or orders or unprocessed updates.',
        switches: [
          { field: 'setPreference', disabledIf: null },
          { field: 'email', disabledIf: 'setPreference' },
          { field: 'inApp', disabledIf: 'setPreference' },
          { field: 'sms', disabledIf: 'setPreference' }
        ]
      }
    ]
  },
  {
    sectionKey: 'orderApproval',
    sectionTitle: 'Order Approval',
    items: [
      {
        itemKey: 'processUpdates',
        itemTitle: 'Process Updates',
        itemDescription: 'Get notified when an order requires your review, approval, or rejection.',
        switches: [
          { field: 'setPreference', disabledIf: null },
          { field: 'email', disabledIf: 'setPreference' },
          { field: 'inApp', disabledIf: 'setPreference' },
          { field: 'sms', disabledIf: 'setPreference' }
        ]
      },
      {
        itemKey: 'reminders',
        itemTitle: 'Reminders',
        itemDescription: 'Receive reminders for orders still awaiting your review or approval.',
        switches: [
          { field: 'setPreference', disabledIf: null },
          { field: 'email', disabledIf: 'setPreference' },
          { field: 'inApp', disabledIf: 'setPreference' },
          { field: 'sms', disabledIf: 'setPreference' }
        ]
      }
    ]
  },
  {
    sectionKey: 'onBehalfOf',
    sectionTitle: 'On Behalf of',
    sectionDescription: 'Get notified when another user submits or manages a prescription or order on behalf of you.',
    items: [
      {
        itemKey: 'onBehalfOf',
        itemTitle: 'On Behalf of',
        switches: [
          { field: 'setPreference', disabledIf: null },
          { field: 'email', disabledIf: 'setPreference' },
          { field: 'inApp', disabledIf: 'setPreference' },
          { field: 'sms', disabledIf: 'setPreference' }
        ]
      }
    ]
  }
];
