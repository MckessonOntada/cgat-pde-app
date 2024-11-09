import { LOCALES } from './locales';
import { LoginMessagesEN } from './login/messages_en';
import { LoginMessagesES } from './login/messages_es';
import { UserManagementEN } from './userManagement/messages_en';
import { UserManagementES } from './userManagement/messages_es';
import { AdminDashboardEN } from './adminDashboard/messages_en';
import { AdminDashboardES } from './adminDashboard/messages_es';
<<<<<<< HEAD
import { OrgManagementEN } from './orgManagement/messages_en';
import { OrgManagementES } from './orgManagement/messages_es';
=======
import { MessageEn as orderManagementMessagesEn } from './order-management/messages_en';
>>>>>>> 1ee0d28abcf4bd48858cbcc99cf7cf33de9b7603

export const messages = {
  [LOCALES.ENGLISH]: {
    ...LoginMessagesEN,
    ...UserManagementEN,
    ...AdminDashboardEN,
<<<<<<< HEAD
    ...OrgManagementEN
=======
    ...orderManagementMessagesEn,
>>>>>>> 1ee0d28abcf4bd48858cbcc99cf7cf33de9b7603
  },
  [LOCALES.SPANISH]: {
    ...LoginMessagesES,
    ...UserManagementES,
    ...AdminDashboardES,
    ...OrgManagementES
  }
};
