
const HeaderConfig = {
    navLinks: [
        {
            label: 'Dashboard',
            path: 'dashboard',
            id: 1,
            configName: "Dashboard",
            isActive: true,
            isActiveTab: false,
            labelForMobile: 'Dashboard',
            sequence: 1
        },
        {
            label: 'Orders',
            id: 2,
            configName: 'Orders',
            path: '/orders',
            isActive: true,
            isActiveTab: false,
            labelForMobile: 'Orders',
            sequence: 2
        },
        {
            label: 'Payment and Invoices',
            path: '/payment-invoices',
            id: 3,
            configName: 'Payment Invoices',
            isActive: true,
            isActiveTab: false,
            labelForMobile: 'Payment and Invoices',
            sequence: 3,
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
            path: 'admin',
            id: 4,
            configName: 'Admin',
            isActive: true,
            isActiveTab: false,
            labelForMobile: 'Admin',
            sequence: 4
        }
    ]
}

export default HeaderConfig;