export const ROLE_DATA = {
  content: [
    {
      createdAt: '2024-01-01T12:00:00Z',
      updatedAt: '2024-01-10T15:00:00Z',
      id: 1,
      name: 'SYSTEM_ADMIN',
      description: 'System Admin',
      permissions: [
        'ADD_ORGANIZATION',
        'VIEW_ORGANIZATION',
        'ON_BEHALF_OF_USER',
        'MANAGE_SYSTEM_CONFIGURATIONS',
        'EDIT_SYSTEM_ADMINISTRATOR',
        'VIEW_ORDERS',
        'CREATE_INVOICES',
        'EDIT_ORDERS',
        'ADD_SYSTEM_ADMINISTRATOR',
        'ADD_ROLES',
        'EDIT_ORGANIZATION',
        'MANAGE_ORDERS',
        'VIEW_ACCOUNTS',
        'MANAGE_USERS_SCREEN',
        'MANAGE_ORGANIZATION_SCREEN',
        'VIEW_CUSTOMER_STATEMENT',
        'EDIT_USERS',
        'UPLOAD_USERS',
        'VIEW_PAYMENT_METHOD',
        'ADD_PAYMENT_METHOD',
        'MANAGE_PAYMENT_METHODS',
        'VIEW_SYSTEM_ADMINISTRATOR',
        'VIEW_USERS',
        'ADD_USERS',
        'VIEW_INVOICES',
        'CREATE_USER_FOR_PENDING_USER_REQUEST',
        'VIEW_ROLES',
        'APPROVE_ORDERS',
        'CREATE_QUESTIONNIARE',
        'MANAGE_CATALOG_CONFIGURATIONS',
        'CREATE_ORDERS',
        'VIEW_PAYMENT_HISTORY',
        'MANAGE_INVOICES'
      ],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-02T09:15:00Z',
      updatedAt: '2024-01-10T11:30:00Z',
      id: 2,
      name: 'ORG_ADMIN',
      description: 'Organization Admin',
      permissions: [
        'VIEW_ORGANIZATION',
        'EDIT_ORGANIZATION',
        'ADD_USERS',
        'VIEW_USERS',
        'EDIT_USERS',
        'VIEW_ORDERS',
        'APPROVE_ORDERS'
      ],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-03T08:45:00Z',
      updatedAt: '2024-01-10T12:20:00Z',
      id: 3,
      name: 'USER_ADMIN',
      description: 'User Admin',
      permissions: ['ADD_USERS', 'EDIT_USERS', 'UPLOAD_USERS', 'VIEW_USERS'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-04T07:30:00Z',
      updatedAt: '2024-01-10T10:00:00Z',
      id: 4,
      name: 'FINANCE_ADMIN',
      description: 'Finance Admin',
      permissions: ['VIEW_INVOICES', 'CREATE_INVOICES', 'MANAGE_INVOICES', 'VIEW_PAYMENT_HISTORY'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-05T10:10:00Z',
      updatedAt: '2024-01-10T14:45:00Z',
      id: 5,
      name: 'ORDER_MANAGER',
      description: 'Order Manager',
      permissions: ['VIEW_ORDERS', 'EDIT_ORDERS', 'MANAGE_ORDERS', 'APPROVE_ORDERS'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-06T11:25:00Z',
      updatedAt: '2024-01-10T16:10:00Z',
      id: 6,
      name: 'CATALOG_ADMIN',
      description: 'Catalog Admin',
      permissions: ['CREATE_QUESTIONNIARE', 'MANAGE_CATALOG_CONFIGURATIONS'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-07T13:50:00Z',
      updatedAt: '2024-01-10T15:30:00Z',
      id: 7,
      name: 'CUSTOMER_SUPPORT',
      description: 'Customer Support',
      permissions: ['VIEW_CUSTOMER_STATEMENT', 'VIEW_PAYMENT_HISTORY'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-08T09:00:00Z',
      updatedAt: '2024-01-10T14:00:00Z',
      id: 8,
      name: 'HR_ADMIN',
      description: 'HR Admin',
      permissions: ['ADD_USERS', 'EDIT_USERS', 'UPLOAD_USERS', 'VIEW_USERS'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-09T14:30:00Z',
      updatedAt: '2024-01-10T15:15:00Z',
      id: 9,
      name: 'PAYMENT_MANAGER',
      description: 'Payment Manager',
      permissions: ['VIEW_PAYMENT_METHOD', 'ADD_PAYMENT_METHOD', 'MANAGE_PAYMENT_METHODS'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T17:30:00Z',
      id: 10,
      name: 'VIEW_ONLY_USER',
      description: 'View-Only User',
      permissions: [
        'VIEW_USERS',
        'VIEW_ROLES',
        'VIEW_INVOICES',
        'VIEW_PAYMENT_HISTORY',
        'VIEW_ORGANIZATION'
      ],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-11T13:00:00Z',
      updatedAt: '2024-01-12T11:30:00Z',
      id: 11,
      name: 'SALES_ADMIN',
      description: 'Sales Admin',
      permissions: ['CREATE_ORDERS', 'VIEW_ORDERS', 'EDIT_ORDERS'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-12T11:15:00Z',
      updatedAt: '2024-01-13T10:50:00Z',
      id: 12,
      name: 'SYSTEM_ANALYST',
      description: 'System Analyst',
      permissions: ['MANAGE_SYSTEM_CONFIGURATIONS', 'VIEW_SYSTEM_ADMINISTRATOR'],
      isActive: true,
      status: 'ACTIVE'
    },

    {
      createdAt: '2024-01-01T12:00:00Z',
      updatedAt: '2024-01-10T15:00:00Z',
      id: 13,
      name: 'SYSTEM_ADMIN',
      description: 'System Admin',
      permissions: [
        'ADD_ORGANIZATION',
        'VIEW_ORGANIZATION',
        'MANAGE_SYSTEM_CONFIGURATIONS',
        'VIEW_ORDERS',
        'CREATE_INVOICES',
        'EDIT_ORDERS',
        'ADD_SYSTEM_ADMINISTRATOR',
        'VIEW_ACCOUNTS',
        'VIEW_USERS',
        'MANAGE_USERS_SCREEN',
        'CREATE_ORDERS',
        'MANAGE_INVOICES'
      ],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-02T09:15:00Z',
      updatedAt: '2024-01-10T11:30:00Z',
      id: 14,
      name: 'ORG_ADMIN',
      description: 'Organization Admin',
      permissions: [
        'VIEW_ORGANIZATION',
        'EDIT_ORGANIZATION',
        'ADD_USERS',
        'VIEW_USERS',
        'EDIT_USERS',
        'VIEW_ORDERS',
        'APPROVE_ORDERS'
      ],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-03T08:45:00Z',
      updatedAt: '2024-01-10T12:20:00Z',
      id: 15,
      name: 'USER_ADMIN',
      description: 'User Admin',
      permissions: ['ADD_USERS', 'EDIT_USERS', 'UPLOAD_USERS', 'VIEW_USERS'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-04T07:30:00Z',
      updatedAt: '2024-01-10T10:00:00Z',
      id: 16,
      name: 'FINANCE_ADMIN',
      description: 'Finance Admin',
      permissions: ['VIEW_INVOICES', 'CREATE_INVOICES', 'MANAGE_INVOICES', 'VIEW_PAYMENT_HISTORY'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-05T10:10:00Z',
      updatedAt: '2024-01-10T14:45:00Z',
      id: 17,
      name: 'ORDER_MANAGER',
      description: 'Order Manager',
      permissions: ['VIEW_ORDERS', 'EDIT_ORDERS', 'MANAGE_ORDERS', 'APPROVE_ORDERS'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-06T11:25:00Z',
      updatedAt: '2024-01-10T16:10:00Z',
      id: 18,
      name: 'CATALOG_ADMIN',
      description: 'Catalog Admin',
      permissions: ['CREATE_QUESTIONNIARE', 'MANAGE_CATALOG_CONFIGURATIONS'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-07T13:50:00Z',
      updatedAt: '2024-01-10T15:30:00Z',
      id: 19,
      name: 'CUSTOMER_SUPPORT',
      description: 'Customer Support',
      permissions: ['VIEW_CUSTOMER_STATEMENT', 'VIEW_PAYMENT_HISTORY'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-08T09:00:00Z',
      updatedAt: '2024-01-10T14:00:00Z',
      id: 20,
      name: 'HR_ADMIN',
      description: 'HR Admin',
      permissions: ['ADD_USERS', 'EDIT_USERS', 'UPLOAD_USERS', 'VIEW_USERS'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-09T14:30:00Z',
      updatedAt: '2024-01-10T15:15:00Z',
      id: 21,
      name: 'PAYMENT_MANAGER',
      description: 'Payment Manager',
      permissions: ['VIEW_PAYMENT_METHOD', 'ADD_PAYMENT_METHOD', 'MANAGE_PAYMENT_METHODS'],
      isActive: true,
      status: 'ACTIVE'
    },
    {
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T17:30:00Z',
      id: 22,
      name: 'VIEW_ONLY_USER',
      description: 'View-Only User',
      permissions: [
        'VIEW_USERS',
        'VIEW_ROLES',
        'VIEW_INVOICES',
        'VIEW_PAYMENT_HISTORY',
        'VIEW_ORGANIZATION'
      ],
      isActive: true,
      status: 'ACTIVE'
    }
  ],
  pageable: {
    pageNumber: 0,
    pageSize: 20,
    sort: {
      empty: false,
      sorted: true,
      unsorted: false
    },
    offset: 0,
    paged: true,
    unpaged: false
  },
  last: true,
  totalPages: 2,
  totalElements: 22,
  first: true,
  size: 21,
  number: 0,
  sort: {
    empty: false,
    sorted: true,
    unsorted: false
  },
  numberOfElements: 21,
  empty: false
};
