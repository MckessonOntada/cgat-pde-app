export const INITIAL_PREFERENCES = {
  USER_MANAGEMENT: {
    PROCESS_UPDATES: { email: false, inApp: false, sms: false },
    REMINDERS: { email: false, inApp: false, sms: false }
  },
  ORDER_MANAGEMENT: {
    PROCESS_UPDATES: { email: false, inApp: false, sms: false },
    REMINDERS: { email: false, inApp: false, sms: false }
  },
  ORDER_APPROVAL: {
    PROCESS_UPDATES: { email: false, inApp: false, sms: false },
    REMINDERS: { email: false, inApp: false, sms: false }
  },
  ON_BEHALF_OF: {
    PROCESS_UPDATES: { email: false, inApp: false, sms: false }
  }
};

export const COMMUNICATION_PREFERENCES = [
  {
    sectionKey: 'USER_MANAGEMENT',
    sectionTitle: 'label.User_Management',
    items: [
      {
        itemKey: 'PROCESS_UPDATES',
        itemTitle: 'label.Process_Updates',
        itemDescription: 'label.user_management.process_updates.description',
        switches: [{ field: 'email' }, { field: 'inApp' }, { field: 'sms' }]
      },
      {
        itemKey: 'REMINDERS',
        itemTitle: 'label.Reminders',
        itemDescription: 'label.user_management.reminders.description',
        switches: [{ field: 'email' }, { field: 'inApp' }, { field: 'sms' }]
      }
    ]
  },
  {
    sectionKey: 'ORDER_MANAGEMENT',
    sectionTitle: 'label.Order_Management',
    items: [
      {
        itemKey: 'PROCESS_UPDATES',
        itemTitle: 'label.Process_Updates',
        itemDescription: 'label.order_management.process_updates.description',
        switches: [{ field: 'email' }, { field: 'inApp' }, { field: 'sms' }]
      },
      {
        itemKey: 'REMINDERS',
        itemTitle: 'label.Reminders',
        itemDescription: 'label.order_management.reminders.description',
        switches: [{ field: 'email' }, { field: 'inApp' }, { field: 'sms' }]
      }
    ]
  },
  {
    sectionKey: 'ORDER_APPROVAL',
    sectionTitle: 'label.Order_Approval',
    items: [
      {
        itemKey: 'PROCESS_UPDATES',
        itemTitle: 'label.Process_Updates',
        itemDescription: 'label.order_approval.process_updates.description',
        switches: [{ field: 'email' }, { field: 'inApp' }, { field: 'sms' }]
      },
      {
        itemKey: 'REMINDERS',
        itemTitle: 'label.Reminders',
        itemDescription: 'label.order_approval.reminders.description',
        switches: [{ field: 'email' }, { field: 'inApp' }, { field: 'sms' }]
      }
    ]
  },
  {
    sectionKey: 'ON_BEHALF_OF',
    sectionTitle: 'label.On_Behalf_of',
    sectionDescription: 'label.on_behalf_of.description',
    items: [
      {
        itemKey: 'PROCESS_UPDATES',
        itemTitle: 'label.On_Behalf_of',
        switches: [{ field: 'email' }, { field: 'inApp' }, { field: 'sms' }]
      }
    ]
  }
];
