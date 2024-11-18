import AppRoutes from '../../routes/AppRoutes';
import { ReactComponent as OrderIcon } from '../../assets/svg/bag-circle.svg';
import { ReactComponent as UserIcon } from '../../assets/svg/user-circle.svg';
import { ReactComponent as ChecklistIcon } from '../../assets/svg/checklist-circle.svg';
import { ReactComponent as CatalogueIcon } from '../../assets/svg/catalogue-circle.svg';
import { ReactComponent as LinkIcon } from '../../assets/svg/link-circle.svg';

const CARDS_DATA = [
  {
    name: 'ManageSystemAdmin',
    label: 'manage_system_admin',
    icon: UserIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: AppRoutes.pathSystemAdminManagement,
    permission: []
  },
  {
    name: 'manageOrg',
    label: 'manage_organization',
    icon: UserIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: AppRoutes.pathOrgManagement,
    permission: []
  },
  {
    name: 'ManageOrderConfiguration',
    label: 'manage_order_configuration',
    icon: OrderIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: '/manage-orders',
    permission: []
  },
  {
    name: 'ManageUsers',
    label: 'manage_users',
    icon: UserIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: AppRoutes.pathUserManagement,
    permission: []
  },
  {
    name: 'ManageRoles',
    label: 'manage_roles',
    icon: ChecklistIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: '/manage-roles',
    permission: []
  },
  {
    name: 'ManageCatalog',
    label: 'manage_catalog',
    icon: CatalogueIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: '/manage-catalog',
    permission: []
  },
  {
    name: 'ViewLinkedAccounts',
    label: 'view_linked_accounts',
    icon: LinkIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: '/linked-accounts',
    permission: []
  }
];

export default CARDS_DATA;
