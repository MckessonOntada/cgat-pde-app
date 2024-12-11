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
import { MessageEs as orderManagementMessagesEs } from './order-management/messages_es';
import { PaymentInvoicesEN } from './payment-Invoices/messages_en';
import { PaymentInvoicesES } from './payment-Invoices/messages_es';
import { AccountEN } from './Accounts/messages_en';
import { AccountES } from './Accounts/messages_es';
import { SignupEN } from './signup/messages_en';
import { SignupES } from './signup/messages_es';
import { filtersEN } from './filters/messages_en';
import { filtersES } from './filters/messages_es';

export const messages = {
  [LOCALES.ENGLISH]: {
    ...LoginMessagesEN,
    ...UserManagementEN,
    ...DashboardEN,
    ...OrgManagementEN,
    ...orderManagementMessagesEn,
    ...PaymentInvoicesES,
    ...PaymentInvoicesEN,
    ...AccountEN,
    ...SignupEN,
    ...filtersEN
  },
  [LOCALES.SPANISH]: {
    ...LoginMessagesES,
    ...UserManagementES,
    ...DashboardES,
    ...OrgManagementES,
    ...orderManagementMessagesEs,
    ...AccountES,
    ...SignupES,
    ...filtersES
  }
};
