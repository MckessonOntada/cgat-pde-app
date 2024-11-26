import AppRoutes from '../../routes/AppRoutes';
import { ReactComponent as OrderIcon } from '../../assets/svg/bag-circle.svg';
import { ReactComponent as UserIcon } from '../../assets/svg/user-circle.svg';
import { ReactComponent as ChecklistIcon } from '../../assets/svg/checklist-circle.svg';
import { ReactComponent as CatalogueIcon } from '../../assets/svg/catalogue-circle.svg';
import { ReactComponent as LinkIcon } from '../../assets/svg/link-circle.svg';

const SYSTEM_ADMIN_CARDS_DATA = [
  {
    name: 'ManageSystemAdmin',
    label: 'manage_system_admin',
    icon: UserIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: AppRoutes.pathSystemAdminManagement,
    permissions: []
  },
  {
    name: 'manageOrg',
    label: 'manage_organization',
    icon: UserIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: AppRoutes.pathOrgManagement,
    permissions: []
  },
];

const CARDS_DATA = [
  {
    name: 'ManageOrderConfiguration',
    label: 'manage_order_configuration',
    icon: OrderIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: '/manage-orders',
    permissions: []
  },
  {
    name: 'ManageUsers',
    label: 'manage_users',
    icon: UserIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: AppRoutes.pathUserManagement,
    permissions: []
  },
  {
    name: 'ManageRoles',
    label: 'manage_roles',
    icon: ChecklistIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: '/organization/roles',
    permissions: []
  },
  {
    name: 'ManageCatalog',
    label: 'manage_catalog',
    icon: CatalogueIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: '/manage-catalog',
    permissions: []
  },
  {
    name: 'ViewLinkedAccounts',
    label: 'view_linked_accounts',
    icon: LinkIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: '/linked-accounts',
    permissions: []
  }
];

export {
  SYSTEM_ADMIN_CARDS_DATA, 
  CARDS_DATA
};
