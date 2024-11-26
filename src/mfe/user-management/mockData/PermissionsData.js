export const ROLES = [
  { label: 'SYSTEM_ADMIN', value: '1' },
  { label: 'Organization Admin', value: '62' }, 
];


export const ROLEPERMISSIONS = {
  "User Management":
    ["ADD_USERS",
      "ADD_ROLES"]
};

export const PERMISSON_DATA = [ 
  {
    "AUTHENTICATION_FLOW": [
      "LOGIN_SCREEN",
      "SYSTEM_ADMIN_LANDING_PAGE"
    ],
    "USER_MANAGEMENT": [
      "MANAGE_USERS",
      "EDIT_USER",
      "APPROVE_PENDING_USER_REQUEST",
      "ADD_SYSTEM_ADMIN",
      "ADD_USERS",
      "UPLOAD_USERS",
      "MANAGE_SYSTEM_ADMIN",
      "EDIT_SYSTEM_ADMIN",
      "ADD_ROLES",
      "MANAGE_ROLES",
      "ON_BEHALF_OF_USER"
    ],
    "ORGANIZATION_MANAGEMENT": [
      "MANAGE_ORGANIZATION",
      "ADD_ORGANIZATION"
    ],
    "ORDER_MANAGEMENT": [
      "MANAGE_ORDERS",
      "APPROVE_ORDERS",
      "CREATE_ORDERS"
    ],
    "APPLICATION_SETTING": [
      "MANAGE_CATALOG_CONFIGURATIONS",
      "CREATE_QUESTIONNAIRE",
      "MANAGE_SYSTEM_CONFIGURATIONS",
      "VIEW_ACCOUNTS",
      "VIEW_INVOICES",
      "MANAGE_INVOICES",
      "VIEW_CUSTOMER_STATEMENT",
      "ADD_PAYMENT_METHOD",
      "CREATE_INVOICES",
      "VIEW_PAYMENT_HISTORY",
      "VIEW_PAYMENT_METHOD",
      "MANAGE_PAYMENT_METHODS"
    ]
  }
]; 