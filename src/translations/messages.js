import { LOCALES } from './locales';
import { LoginMessagesEN } from './login/messages_en';
import { LoginMessagesES } from './login/messages_es';
import { UserManagementEN } from './userManagement/messages_en';
import { UserManagementES } from './userManagement/messages_es';
import { PatientListEN } from './patientList/messages_en';
import { PatientListES } from './patientList/messages_es';

export const messages = {
  [LOCALES.ENGLISH]: {
    ...LoginMessagesEN,
    ...UserManagementEN,
    ...PatientListEN
  },
  [LOCALES.SPANISH]: {
    ...LoginMessagesES,
    ...UserManagementES,
    ...PatientListES
  }
};
