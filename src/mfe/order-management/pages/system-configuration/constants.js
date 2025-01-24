import { ReactComponent as SystemConfigurationManageAccount } from '@src/assets/svg/system_config_manage_account.svg';
import { ReactComponent as SystemConfigurationManageCatalog } from '@src/assets/svg/system_config_manage_catalog.svg';
import { ReactComponent as SystemConfigurationManageMaterial } from '@src/assets/svg/system_config_manage_material.svg';
import { ReactComponent as SystemConfigurationManageQuestionnaire } from '@src/assets/svg/system_config_manage_questionnaire.svg';

const BREADCRUMB_ITEMS = [
  {
    label: 'systemAdministrator',
    url: '/admin'
  },
  {
    label: 'system_configuration'
  }
];

const CONFIG_MODULE_ROUTES = {
  MANAGE_ACCOUNT: 'manage-account',
  MANAGE_CATALOG: 'manage-catalog',
  MANAGE_MATERIAL: 'manage-material',
  MANAGE_QUESTIONNAIRE: 'questionnaire'
};

const CARDS = [
  {
    name: 'SystemConfig_ManageMaterial',
    label: 'system_config_manage_material',
    icon: SystemConfigurationManageMaterial,
    details: 'system_config_description_manage_material',
    path: CONFIG_MODULE_ROUTES.MANAGE_MATERIAL
  },
  {
    name: 'SystemConfig_ManageCatalog',
    label: 'system_config_manage_catalog',
    icon: SystemConfigurationManageCatalog,
    details: 'system_config_description_manage_catalog',
    path: CONFIG_MODULE_ROUTES.MANAGE_CATALOG
  },
  {
    name: 'SystemConfig_ManageQuestionnaire',
    label: 'system_config_manage_questionnaire',
    icon: SystemConfigurationManageQuestionnaire,
    details: 'system_config_description_manage_questionnaire',
    path: CONFIG_MODULE_ROUTES.MANAGE_QUESTIONNAIRE
  },
  {
    name: 'SystemConfig_ManageAccount',
    label: 'system_config_manage_account',
    icon: SystemConfigurationManageAccount,
    details: 'system_config_description_manage_account',
    path: CONFIG_MODULE_ROUTES.MANAGE_ACCOUNT
  }
];

export { BREADCRUMB_ITEMS, CARDS, CONFIG_MODULE_ROUTES };
