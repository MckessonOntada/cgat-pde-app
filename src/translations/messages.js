import { LOCALES } from './locales';
import { LoginMessagesEN } from './login/messages_en';
import { LoginMessagesES } from './login/messages_es';
import { UserManagementEN } from './userManagement/messages_en';
import { UserManagementES } from './userManagement/messages_es';
import { DashboardEN } from './dashboard/messages_en';
import { DashboardES } from './dashboard/messages_es';
import { OrgManagementEN } from './orgManagement/messages_en';
import { OrgManagementES } from './orgManagement/messages_es';
import { MessageEn as orderManagementMessagesEn } from './order-management/messages_en';

export const messages = {
  [LOCALES.ENGLISH]: {
    ...LoginMessagesEN,
    ...UserManagementEN,
    ...DashboardEN,
    ...OrgManagementEN,
    ...orderManagementMessagesEn,
  },
  [LOCALES.SPANISH]: {
    ...LoginMessagesES,
    ...UserManagementES,
    ...DashboardES,
    ...OrgManagementES
  }
};
