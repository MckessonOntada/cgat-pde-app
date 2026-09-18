export const EMPTY_RECIPIENT = { firstName: '', middleName: '', lastName: '', email: '' };

export const DEFAULT_TAB_STATE = {
  1: { notifications: null, addRecipients: null, recipients: null },
  2: { notifications: null, addRecipients: null, recipients: null }
};

export const TAB_LIST = [
  { id: 1, configName: 'manageMaterial.notificationSettings.Tab1', sequence: 1, labelForMobile: 'manageMaterial.notificationSettings.Tab1' },
  { id: 2, configName: 'manageMaterial.notificationSettings.Tab2', sequence: 2, labelForMobile: 'manageMaterial.notificationSettings.Tab2' }
];

export const NOTIFICATION_TYPES = {
  ORDER_SUBMIT: 'ORDER_SUBMIT',
  PATIENT_INGESTION: 'PATIENT_INGESTION'
};

export const RECIPIENT_ACTION_OPTIONS = [
  { label: 'Edit', value: 'edit' },
  { label: 'Delete', value: 'delete' }
];

export const ROUTES = {
  MATERIAL: '/system-admin/config/manage-material',
  SP_MATERIAL: '/system-admin/config/manage-sp-material',
  MATERIAL_NOTIFICATION_SETTINGS: '/system-admin/config/manage-material/notification-settings',
  SP_MATERIAL_NOTIFICATION_SETTINGS: '/system-admin/config/manage-sp-material/notification-settings'
};
