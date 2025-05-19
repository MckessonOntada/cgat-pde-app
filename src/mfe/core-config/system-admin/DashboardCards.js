import { ReactComponent as UserIcon } from '@src/assets/svg/user-circle.svg';
import { ReactComponent as organizationIcon } from '@src/assets/svg/organizationIcon.svg';
import { ReactComponent as SystemConfigurationIcon } from '@src/assets/svg/system_configuration_icon.svg';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
import AppRoutes from '@src/routes/AppRoutes';

const { USER_MANAGEMENT, ORGANIZATION_MANAGEMENT, SYSTEM_CONFIGURATION } = PERMISSIONS_ENUM;

const SYSTEM_ADMIN_CARDS_DATA = [
  {
    name: 'ManageSystemAdmin',
    label: 'manage_system_admin',
    icon: UserIcon,
    details: 'systemAdmin_card_description',
    path: AppRoutes.pathSystemAdminManagement,
    permissions: USER_MANAGEMENT.MANAGE_SYSTEM_ADMINISTRATOR_SCREEN
  },
  {
    name: 'manageOrg',
    label: 'manage_organization',
    icon: organizationIcon,
    details: 'organization_card_description',
    path: AppRoutes.pathOrgManagement,
    permissions: ORGANIZATION_MANAGEMENT.MANAGE_ORGANIZATION_SCREEN
  },
  {
    name: 'systemConfiguration',
    label: 'system_configuration',
    icon: SystemConfigurationIcon,
    details: 'system_configuration_card_description',
    path: AppRoutes.pathSystemConfiguration,
    permissions: SYSTEM_CONFIGURATION
  }
];

export { SYSTEM_ADMIN_CARDS_DATA };
