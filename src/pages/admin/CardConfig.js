import { ReactComponent as ChecklistIcon } from '../../assets/svg/checklist-circle.svg';
import { ReactComponent as ApproverGroupIcon } from '../../assets/svg/approvergroup_icon.svg';
import { ReactComponent as CatalogueIcon } from '../../assets/svg/catalogue-circle.svg';
import { ReactComponent as UserIcon } from '../../assets/svg/user-circle.svg';
import { ReactComponent as LinkIcon } from '../../assets/svg/link-circle.svg';
import AppRoutes from '../../routes/AppRoutes';
import { PERMISSIONS_ENUM } from '@src/mfe/user-management/pages/UserPermissions/permissionsEnum';
const { USER_MANAGEMENT, ORDER_MANAGEMENT } = PERMISSIONS_ENUM;

const cardList = [
  {
    name: 'ManageUsers',
    label: 'manage_users',
    icon: UserIcon,
    details: 'efficiently_streamline_user_management_for_seamless_experience',
    path: AppRoutes.pathUserManagement,
    permissions: USER_MANAGEMENT.MANAGE_USERS_SCREEN
  },
  {
    name: 'ManageRoles',
    label: 'manage_roles',
    icon: ChecklistIcon,
    details: 'role_card_description',
    path: AppRoutes.pathOrganizationRoles,
    permissions: USER_MANAGEMENT.MANAGE_ROLES_SCREEN
  },
  {
    name: 'ManageApproverGroups',
    label: 'manage_approver_groups',
    icon: ApproverGroupIcon,
    details: 'approver_management_description',
    path: AppRoutes.pathApproverManagement,
    permissions: ORDER_MANAGEMENT.MANAGE_APPROVER_GROUP
  }
];

export default cardList;
