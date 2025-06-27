import { ReactComponent as UserIcon } from '@src/assets/svg/user-circle.svg';
import { ReactComponent as organizationIcon } from '@src/assets/svg/organizationIcon.svg';
import { ReactComponent as SystemConfigurationIcon } from '@src/assets/svg/system_configuration_icon.svg';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import AppRoutes from '@src/routes/AppRoutes';

const { ADMIN_MANAGEMENT, USER_MANAGEMENT, ORGANIZATION_MANAGEMENT, SYSTEM_CONFIGURATION } = PERMISSIONS_ENUM;

const SYSTEM_ADMIN_CARDS_DATA = [
  {
    name: 'ManageSystemAdmin',
    label: 'manage_system_admin',
    icon: UserIcon,
    details: 'systemAdmin_card_description',
    path: AppRoutes.pathSystemAdminManagement,
    permissions: Object.values(ADMIN_MANAGEMENT)
  },
  {
    name: 'manageOrg',
    label: 'manage_organization',
    icon: organizationIcon,
    details: 'organization_card_description',
    path: AppRoutes.pathOrgManagement,
    permissions: Object.values(ORGANIZATION_MANAGEMENT)
  },
  {
    name: 'systemConfiguration',
    label: 'system_configuration',
    icon: SystemConfigurationIcon,
    details: 'system_configuration_card_description',
    path: AppRoutes.pathSystemConfiguration,
    permissions: Object.values(SYSTEM_CONFIGURATION)
  }
];

const CARDS_DATA = [];
export { SYSTEM_ADMIN_CARDS_DATA, CARDS_DATA };
