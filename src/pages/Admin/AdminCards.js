import { ADMIN_PATHS } from "../../routes/constants"; 

const CARDS_DATA = [
  {
    name: "ManageOrderConfiguration",
    label: "manage_order_configuration",
    icon: "order-icon-url", 
    details: "efficiently_streamline_user_management_for_seamless_experience",
    path: "/manage-orders",
    permission: [] 
  },
  {
    name: "ManageUsers",
    label: "manage_users",
    icon: "user-icon-url", 
    details: "efficiently_streamline_user_management_for_seamless_experience",
    path: ADMIN_PATHS.userDashboard,
    permission: [] 
  },
  {
    name: "ManageRoles",
    label: "manage_roles",
    icon: "roles-icon-url", 
    details: "efficiently_streamline_user_management_for_seamless_experience",
    path: "/manage-roles",
    permission: [] 
  },
  {
    name: "ManageCatalog",
    label: "manage_catalog",
    icon: "catalog-icon-url", 
    details: "efficiently_streamline_user_management_for_seamless_experience",
    path: "/manage-catalog",
    permission: [] 
  },
  {
    name: "ViewLinkedAccounts",
    label: "view_linked_accounts",
    icon: "linked-accounts-icon-url", 
    details: "efficiently_streamline_user_management_for_seamless_experience",
    path: "/linked-accounts",
    permission: [] 
  }
];

export default CARDS_DATA;