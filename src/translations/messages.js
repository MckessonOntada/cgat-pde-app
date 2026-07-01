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

import { SystemConfigurationEN } from './config/manage-material/messages_en';
import { SystemConfigurationES } from './config/manage-material/messages_es';
import { ManageCatalogMessagesEN } from './config/manage-catalog/messages_en';
import { ManageCatalogMessagesES } from './config/manage-catalog/messages_es';
import { ManageAccountMessagesEN } from './config/manage-account/messages_en';
import { ManageAccountMessagesES } from './config/manage-account/messages_es';
import { ManageSPMateriaMessagesEN } from './config/manage-sp-material/messages_en';
import { ManageSPMaterialMessagesES } from './config/manage-sp-material/messages_es';
import { ManageSPAccountMessagesEN } from './config/manage-sp-account/messages_en';
import { ManageSPAccountMessagesES } from './config/manage-sp-account/messages_es';
import { ConfigurationMessagesEN } from './config/messages_en';
import { ConfigurationMessagesES } from './config/messages_es';
import { NotificationMessagesEN } from './notification-mfe/messages_en';
import { NotificationMessagesES } from './notification-mfe/messages_es';
import { NotificationGroupMessageEN } from './order-management/notification-group/messages_en';
import { NotificationGroupMessageES } from './order-management/notification-group/messages_es';

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
    ...ManageAccountMessagesEN,
    ...ManageSPMateriaMessagesEN,
    ...ManageSPAccountMessagesEN,
    ...ConfigurationMessagesEN,
    ...NotificationMessagesEN,
    ...NotificationGroupMessageEN
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
    ...ManageAccountMessagesES,
    ...ManageSPMaterialMessagesES,
    ...ManageSPAccountMessagesES,
    ...ConfigurationMessagesES,
    ...NotificationMessagesES,
    ...NotificationGroupMessageES
  }
};
