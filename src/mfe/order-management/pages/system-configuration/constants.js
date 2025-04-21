import { ReactComponent as SystemConfigurationManageAccount } from '@src/assets/svg/system_config_manage_account.svg';
import { ReactComponent as SystemConfigurationManageCatalog } from '@src/assets/svg/system_config_manage_catalog.svg';
import { ReactComponent as SystemConfigurationManageMaterial } from '@src/assets/svg/system_config_manage_material.svg';
import { ReactComponent as SystemConfigurationManageQuestionnaire } from '@src/assets/svg/system_config_manage_questionnaire.svg';
import { ReactComponent as SystemConfigurationSPCatalog } from '@src/assets/svg/SPCatalog.svg';
import { ReactComponent as SystemConfigurationSPAccounts } from '@src/assets/svg/SPAccounts.svg';
import { ReactComponent as SystemConfigurationMaterialCrosswalk } from '@src/assets/svg/Material-Crosswalk.svg';
import { ReactComponent as SystemConfigurationSPMaterial } from '@src/assets/svg/SPMaterial.svg';
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
  MANAGE_QUESTIONNAIRE: 'questionnaire',
  MANAGE_SPACCOUNT: 'manage-spaccount',
  MANAGE_SPCATALOG: '/admin/sp-catalog',
  MANAGE_SPMATERIAL: 'manage-spmaterial',
  MATERIAL_CROSSWALK: '/admin/crosswalk'
};

const CARDS = [
  {
    heading: 'dashboard.card.system_config_standard_settings',
    name: 'SystemConfig_ManageMaterial',
    label: 'system_config_manage_material',
    icon: SystemConfigurationManageMaterial,
    details: 'system_config_description_manage_material',
    path: CONFIG_MODULE_ROUTES.MANAGE_MATERIAL
  },
  {
    heading: 'dashboard.card.system_config_standard_settings',
    name: 'SystemConfig_ManageCatalog',
    label: 'system_config_manage_catalog',
    icon: SystemConfigurationManageCatalog,
    details: 'system_config_description_manage_catalog',
    path: CONFIG_MODULE_ROUTES.MANAGE_CATALOG
  },
  {
    heading: 'dashboard.card.system_config_standard_settings',
    name: 'SystemConfig_ManageQuestionnaire',
    label: 'system_config_manage_questionnaire',
    icon: SystemConfigurationManageQuestionnaire,
    details: 'system_config_description_manage_questionnaire',
    path: CONFIG_MODULE_ROUTES.MANAGE_QUESTIONNAIRE
  },
  {
    heading: 'dashboard.card.system_config_standard_settings',
    name: 'SystemConfig_ManageAccount',
    label: 'system_config_manage_account',
    icon: SystemConfigurationManageAccount,
    details: 'system_config_description_manage_account',
    path: CONFIG_MODULE_ROUTES.MANAGE_ACCOUNT
  },
  {
    heading: 'dashboard.card.system_config_sp_settings',
    name: 'SystemConfig_ManageSPMaterial',
    label: 'system_config_manage_spmaterial',
    icon: SystemConfigurationSPMaterial,
    details: 'system_config_description_manage_spmaterial',
    path: CONFIG_MODULE_ROUTES.MANAGE_SPMATERIAL
  },
  // {
  //   heading: 'dashboard.card.system_config_sp_settings',
  //   name: 'SystemConfig_MaterialCrossWalk',
  //   label: 'system_config_manage_materialcrosswalk',
  //   icon: SystemConfigurationMaterialCrosswalk,
  //   details: 'system_config_description_material_crosswalk',
  //   path: CONFIG_MODULE_ROUTES.MATERIAL_CROSSWALK
  // },
  // {
  //   heading: 'dashboard.card.system_config_sp_settings',
  //   name: 'SystemConfig_ManageSPCatalog',
  //   label: 'system_config_manage_spcatalog',
  //   icon: SystemConfigurationSPCatalog,
  //   details: 'system_config_description_manage_spcatalog',
  //   path: CONFIG_MODULE_ROUTES.MANAGE_SPCATALOG
  // },
  {
    heading: 'dashboard.card.system_config_sp_settings',
    name: 'SystemConfig_ManageSPAccount',
    label: 'system_config_manage_spaccount',
    icon: SystemConfigurationSPAccounts,
    details: 'system_config_description_manage_spaccount',
    path: CONFIG_MODULE_ROUTES.MANAGE_SPACCOUNT
  }
];

export { BREADCRUMB_ITEMS, CARDS, CONFIG_MODULE_ROUTES };
