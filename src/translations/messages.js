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
import { ApproverManagementEN as approverGroupMessagesEn } from './order-management/approver-group/messages_en';
import { ApproverManagementES as approverGroupMessagesEs } from './order-management/approver-group/messages_es';
import { PaymentInvoicesEN } from './finance-management/messages_en';
import { PaymentInvoicesES } from './finance-management/messages_es';
import { AccountEN } from './Accounts/messages_en';
import { AccountES } from './Accounts/messages_es';
import { SignupEN } from './signup/messages_en';
import { SignupES } from './signup/messages_es';
import { filtersEN } from './filters/messages_en';
import { filtersES } from './filters/messages_es';
import { SystemConfigurationEN } from './order-management/system-configuration/manage-material/messages_en';
import { SystemConfigurationES } from './order-management/system-configuration/manage-material/messages_es';
import { ManageCatalogMessagesEN } from './order-management/system-configuration/manage-catalog/messages_en';
import { ManageCatalogMessagesES } from './order-management/system-configuration/manage-catalog/messages_es';
import { ManageAccountMessagesEN } from './order-management/system-configuration/manage-account/messages_en';
import { ManageAccountMessagesES } from './order-management/system-configuration/manage-account/messages_es';

export const messages = {
  [LOCALES.ENGLISH]: {
    ...LoginMessagesEN,
    ...UserManagementEN,
    ...DashboardEN,
    ...OrgManagementEN,
    ...orderManagementMessagesEn,
    ...PaymentInvoicesEN,
    ...AccountEN,
    ...SignupEN,
    ...filtersEN,
    ...approverGroupMessagesEn,
    ...SystemConfigurationEN,
    ...ManageCatalogMessagesEN,
    ...ManageAccountMessagesEN
  },
  [LOCALES.SPANISH]: {
    ...LoginMessagesES,
    ...UserManagementES,
    ...DashboardES,
    ...OrgManagementES,
    ...orderManagementMessagesEs,
    ...PaymentInvoicesES,
    ...AccountES,
    ...SignupES,
    ...filtersES,
    ...approverGroupMessagesEs,
    ...SystemConfigurationES,
    ...ManageCatalogMessagesES,
    ...ManageAccountMessagesES
  }
};
