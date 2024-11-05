import { LOCALES } from './locales';
import { LoginMessagesEN } from './login/messages_en';
import { LoginMessagesES } from './login/messages_es';
import { UserManagementEN } from './userManagement/messages_en';
import { UserManagementES } from './userManagement/messages_es';

export const messages = {
  [LOCALES.ENGLISH]: {
    ...LoginMessagesEN,
    ...UserManagementEN,
  },
  [LOCALES.SPANISH]: {
    ...LoginMessagesES,
    ...UserManagementES,
  }
};
