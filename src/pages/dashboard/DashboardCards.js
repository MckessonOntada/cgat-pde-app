import AppRoutes from '../../routes/AppRoutes';
import { ReactComponent as OrderIcon } from '../../assets/svg/bag-circle.svg';
import { ReactComponent as UserIcon } from '../../assets/svg/user-circle.svg';
import { ReactComponent as organizationIcon } from '../../assets/svg/organizationIcon.svg';
import { ReactComponent as SystemConfigurationIcon } from '@src/assets/svg/system_configuration_icon.svg';
import { ReactComponent as ChecklistIcon } from '../../assets/svg/checklist-circle.svg';
import { ReactComponent as ApproverGroupIcon } from '../../assets/svg/approvergroup_icon.svg';
import { ReactComponent as CatalogueIcon } from '../../assets/svg/catalogue-circle.svg';
import { ReactComponent as LinkIcon } from '../../assets/svg/link-circle.svg';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';

const { USER_MANAGEMENT, ORGANIZATION_MANAGEMENT, SYSTEM_CONFIGURATION } =
  PERMISSIONS_ENUM;

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

const CARDS_DATA = [
  // {
  //   name: 'ManageOrders',
  //   label: 'manage_orders',
  //   icon: OrderIcon,
  //   details: 'order_card_description',
  //   path: AppRoutes.pathOrderManagement,
  //   permissions: ORDER_MANAGEMENT.MANAGE_ORDERS
  // },
  // {
  //   name: 'ManageUsers',
  //   label: 'manage_users',
  //   icon: UserIcon,
  //   details: 'efficiently_streamline_user_management_for_seamless_experience',
  //   path: AppRoutes.pathUserManagement,
  //   permissions: USER_MANAGEMENT.MANAGE_USERS_SCREEN
  // },
  // {
  //   name: 'ManageRoles',
  //   label: 'manage_roles',
  //   icon: ChecklistIcon,
  //   details: 'role_card_description',
  //   path: '/organization/roles',
  //   permissions: USER_MANAGEMENT.MANAGE_ROLES_SCREEN
  // },
  // {
  //   name: 'ManageApproverGroups',
  //   label: 'manage_approver_groups',
  //   icon: ApproverGroupIcon,
  //   details: 'approver_management_description',
  //   path: AppRoutes.pathApproverManagement,
  //   permissions: ORDER_MANAGEMENT.MANAGE_APPROVER_GROUP
  // }
  // {
  //   name: 'ManageCatalog',
  //   label: 'manage_catalog',
  //   icon: CatalogueIcon,
  //   details: 'efficiently_streamline_user_management_for_seamless_experience',
  //   path: '/manage-catalog',
  //   permissions: []
  // },
  // {
  //   name: 'ViewLinkedAccounts',
  //   label: 'view_linked_accounts',
  //   icon: LinkIcon,
  //   details: 'efficiently_streamline_user_management_for_seamless_experience',
  //   path: '/linked-accounts',
  //   permissions: []
  // }
];

export { SYSTEM_ADMIN_CARDS_DATA, CARDS_DATA };
