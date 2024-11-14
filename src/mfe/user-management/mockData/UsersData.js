export const ROLES = [
  { label: 'ORGANIZATION ADMIN', value: 'ORGANIZATION ADMIN' },
  { label: 'Supervisor', value: 'Supervisor' },
  { label: 'SuperAdmin', value: 'SuperAdmin' }
];

export const STATUS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' }
];

export const USER_DATA = [
  {
    id: 1,
    name: {
      firstName: "John",
      middleName: "",
      lastName: "Smithtest"
    },
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "123456"
    },
    contact: {
      e_mail: "john.smith@companydomain.com",
      phone: "",
      fax: ""
    },
    permissions : [
      "ADD_USER"
    ],
    role: {
      id: 0,
      name: "ORGANIZATION ADMIN",
      description: "string",
      permissions: [
        "ADD_USER"
      ]
    },
    "isActive": true,
    date_added: "07/17/2024",
    date_updated: "07/17/2024"
  },
  {
    id: 2,
    name: {
      firstName: "Darlene",
      middleName: "",
      lastName: "Robertson"
    },
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "12345"
    },
    contact: {
      e_mail: "darlene.robertson@companydomain.com",
      phone: "",
      fax: ""
    },
    permissions : [
      "ADD_USER"
    ],
    role: {
      id: 0,
      name: "ORGANIZATION ADMIN",
      description: "string",
      permissions: [
        "ADD_USER"
      ]
    },
    "isActive": true,
    date_added: "07/17/2024",
    date_updated: "07/18/2024"
  },
  {
    id: 3,
    name: {
      firstName: "Wade",
      middleName: "",
      lastName: "Warren"
    },
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: ""
    },
    contact: {
      e_mail: "wade.warren@testdomain.com",
      phone: "",
      fax: ""
    },
    permissions : [
      "ADD_USER"
    ],
    role: {
      id: 0,
      name: "ORGANIZATION USER",
      description: "string",
      permissions: [
        "ADD_USER"
      ]
    },
    "isActive": true,
    date_added: "07/19/2024",
    date_updated: "07/19/2024"
  },
  {
    id: 4,
    name: {
      firstName: "Ronald",
      middleName: "",
      lastName: "Richards"
    },
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: ""
    },
    contact: {
      e_mail: "ronald.richards@companydomain.com",
      phone: "",
      fax: ""
    },
    permissions : [
      "ADD_USER"
    ],
    role: {
      id: 0,
      name: "ORGANIZATION ADMIN",
      description: "string",
      permissions: [
        "ADD_USER"
      ]
    },
    "isActive": false,
    date_added: "07/17/2024",
    date_updated: "07/20/2024"
  },
  {
    id: 5,
    name: {
      firstName: "Courtney",
      middleName: "",
      lastName: "Henry"
    },
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: ""
    },
    contact: {
      e_mail: "courtney.henry@newdomain.com",
      phone: "",
      fax: ""
    },
    permissions : [
      "ADD_USER"
    ],
    role: {
      id: 0,
      name: "ORGANIZATION ADMIN",
      description: "string",
      permissions: [
        "ADD_USER"
      ]
    },
    "isActive": true,
    date_added: "07/17/2024",
    date_updated: "07/21/2024"
  },
  {
    id: 6,
    name: {
      firstName: "Bessie",
      middleName: "",
      lastName: "Cooper"
    },
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: ""
    },
    contact: {
      e_mail: "bessie.cooper@testdomain.com",
      phone: "",
      fax: ""
    },
    role: "ORGANIZATION USER",
    status: "ACTIVE",
    date_added: "07/17/2024",
    date_updated: "07/07/2024"
  },
  {
    id: 7,
    name: {
      firstName: "Annette",
      middleName: "A",
      lastName: "Black"
    },
    address: {
      address1: "test",
      address2: "test",
      city: "test",
      state: "maharashtra",
      zip: "123456"
    },
    contact: {
      e_mail: "annette.black@dummydomain.com",
      phone: "2342342423",
      fax: "243424242340987"
    },
    permissions : {
      "USER_MANAGEMENT" : [
      "ADD_USERS",
      "ADD_ROLES",
      "APPROVE_PENDING_USER_REQUEST",
      "MANAGE_USERS"
    ],
    "AUTHENTICATION_FLOW": [
      "LOGIN_SCREEN"
    ],
    "ORDER_MANAGEMENT": [
      "MANAGE_ORDERS",
      "CREATE_ORDERS"
    ]
    },
    role: {
      id: 0,
      name: "ORGANIZATION ADMIN",
      description: "string",
      permissions: [
        "ADD_USER"
      ]
    },
    "isActive": true,
    date_added: "07/17/2024",
    date_updated: "07/30/2024"
  },
  {
    id: 8,
    name: {
      firstName: "Jerome",
      middleName: "",
      lastName: "Bell"
    },
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: ""
    },
    contact: {
      e_mail: "jerome.bell@companydomain.com",
      phone: "",
      fax: ""
    },
    permissions : [
      "ADD_USER"
    ],
    role: {
      id: 0,
      name: "ORGANIZATION USER",
      description: "string",
      permissions: [
        "ADD_USER"
      ]
    },
    "isActive": true,
    // status: "ACTIVE",
    date_added: "07/17/2024",
    date_updated: "07/27/2024"
  },
  {
    id: 9,
    name: {
      firstName: "Jerome",
      middleName: "",
      lastName: "Bell"
    },
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: ""
    },
    contact: {
      e_mail: "jerome.bell@companydomain.com",
      phone: "",
      fax: ""
    },
    permissions : [
      "ADD_USER"
    ],
    role: {
      id: 0,
      name: "ORGANIZATION ADMIN",
      description: "string",
      permissions: [
        "ADD_USER"
      ]
    },
    "isActive": true,
    date_added: "07/17/2024",
    date_updated: "07/06/2024"
  },
  {
    id: 10,
    name: {
      firstName: "Jerome",
      middleName: "",
      lastName: "Bell"
    },
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: ""
    },
    contact: {
      e_mail: "jerome.bell@companydomain.com",
      phone: "",
      fax: ""
    },
    permissions : [
      "ADD_USER"
    ],
    role: {
      id: 0,
      name: "ORGANIZATION ADMIN",
      description: "string",
      permissions: [
        "ADD_USER"
      ]
    },
    "isActive": true,
    date_added: "07/17/2024",
    date_updated: "07/01/2024"
  },
  {
    id: 11,
    name: {
      firstName: "Jerome",
      middleName: "",
      lastName: "Bell"
    },
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: ""
    },
    contact: {
      e_mail: "jerome.bell@companydomain.com",
      phone: "",
      fax: ""
    },
    permissions : [
      "ADD_USER"
    ],
    role: {
      id: 0,
      name: "ORGANIZATION ADMIN",
      description: "string",
      permissions: [
        "ADD_USER"
      ]
    },
    "isActive": true,
    date_added: "07/17/2024",
    date_updated: "07/02/2024"
  },
  {
    id: 12,
    name: {
      firstName: "Jerome",
      middleName: "",
      lastName: "Bell"
    },
    address: {
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: ""
    },
    contact: {
      e_mail: "jerome.bell@companydomain.com",
      phone: "",
      fax: ""
    },
    permissions : [
      "ADD_USER"
    ],
    role: {
      id: 0,
      name: "ORGANIZATION ADMIN",
      description: "string",
      permissions: [
        "ADD_USER"
      ]
    },
    "isActive": true,
    date_added: "07/17/2024",
    date_updated: "07/13/2024"
  }
];
 

