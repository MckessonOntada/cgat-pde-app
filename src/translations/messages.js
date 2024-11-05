import { LOCALES } from './locales';
import { LoginMessagesEN } from './login/messages_en';
import { LoginMessagesES } from './login/messages_es';
import { UserManagementEN } from './userManagement/messages_en';
import { UserManagementES } from './userManagement/messages_es';
import { AdminDashboardEN } from './adminDashboard/messages_en';
import { AdminDashboardES } from './adminDashboard/messages_es';

export const messages = {
  [LOCALES.ENGLISH]: {
    ...LoginMessagesEN,
    ...UserManagementEN,
    ...AdminDashboardEN
  },
  [LOCALES.SPANISH]: {
    ...LoginMessagesES,
    ...UserManagementES, 
    ...AdminDashboardES
  }
};
