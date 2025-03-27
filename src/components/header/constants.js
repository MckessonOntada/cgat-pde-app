import { routePermissionConfig } from '@src/routes/RoutePermissionConstats';
import { LOCALES } from '@src/translations/locales';

const HeaderConfig = {
  navLinks: [
    // {
    //   label: 'Dashboard',
    //   path: '/',
    //   id: 1,
    //   configName: 'Dashboard',
    //   isActive: true,
    //   isActiveTab: false,
    //   labelForMobile: 'Dashboard',
    //   sequence: 1,
    //   translationName: 'header.tabs.dashboard'
    // },
    {
      label: 'Orders',
      id: 4,
      configName: 'Orders',
      path: '/orders',
      isActive: true,
      isActiveTab: false,
      labelForMobile: 'Orders',
      translationName: 'header.tabs.orders',
      permittedRoute: routePermissionConfig.orders,
      sequence: 2
    },
    {
      label: 'Payment and Invoices',
      path: '/record',
      id: 3,
      configName: 'Payment Invoices',
      isActive: true,
      isActiveTab: false,
      labelForMobile: 'Payment and Invoices',
      sequence: 3,
      translationName: 'header.tabs.paymentAndInvoices',
      permittedRoute: routePermissionConfig.paymentInvoices,
      submenu: [
        {
          label: 'Invoices',
          target: 'invoices'
        },
        {
          label: 'Payment History',
          target: 'payment-history'
        },
        {
          label: 'Customer Statement',
          target: 'customer-statement'
        }
      ]
    },
    {
      label: 'Admin',
      path: '/admin',
      id: 5,
      configName: 'Admin',
      isActive: true,
      isActiveTab: false,
      labelForMobile: 'Admin',
      translationName: 'header.tabs.admin',
      permittedRoute: [...routePermissionConfig.approvergroups, ...routePermissionConfig.roles, ...routePermissionConfig.users],
      sequence: 1
    }
  ],
  profileOptions: [
    {
      label: 'Profile Settings',
      value: '#',
    },
    {
      label: 'Account Setting',
      value: '/admin/user/account-setting',
    },
  ],
  languages: [
    {
      label: 'English',
      value: LOCALES.ENGLISH
    },
    {
      label: 'Spanish',
      value: LOCALES.SPANISH
    }
  ]
};

export default HeaderConfig;
