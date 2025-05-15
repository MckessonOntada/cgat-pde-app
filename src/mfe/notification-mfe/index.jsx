import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Heading,
  Button,
  DateRangePicker,
  Dropdown,
  Alert
} from '@mckesson/mcp-component-library';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import './index.scss';
import NotificationLister from './components/NotificationLister/NotificationLister';
import NotificationViewer from './components/NotificationViewer/NotificationViewer';
import FilterToolbar from './components/FilterToolbar/FilterToolbar';

const notificationsMock = [
  {
    id: 1,
    title:
      'Reminder: Pending User Approval Requests - Please Review and Take Action Promptly',
    description:
      'You have pending user registration requests awaiting approval.',
    date: '01/08/2025 10:20 PM',
    unread: true,
    details: {
      type: 'reminder',
      table: [
        { name: 'Adam Cuma', email: 'john.smith@companydomain.com' },
        {
          name: 'Darlene Robertson',
          email: 'darlene.robertson@companydomain.com'
        }
      ],
      message: `Hello Adam,

This is a reminder that the following user registration requests are pending approval and have exceeded the 10 hours review period:`,
      timeAgo: '4 Min ago • 01/07/2025',
      section: 'Order Management'
    }
  },
  {
    id: 2,
    title: 'New Organization Created',
    description:
      'A new organization, Acme Health, has been created and is now active.',
    date: '01/08/2025 11:00 AM',
    unread: true,
    details: {
      type: 'info',
      table: [],
      message:
        'Organization Acme Health is now available for user assignments.',
      timeAgo: '2 hours ago • 01/08/2025',
      section: 'Organization Management'
    }
  },
  {
    id: 3,
    title: 'Welcome to Your System Admin Account',
    description:
      'Your system admin account is now active. Please log in to complete your profile setup.',
    date: '01/07/2025 10:20 AM',
    unread: false,
    details: {
      type: 'welcome',
      table: [],
      message:
        'Welcome! Your system admin account is ready. Please log in to get started.',
      timeAgo: '1 day ago • 01/07/2025',
      section: 'User Management'
    }
  },
  {
    id: 4,
    title: 'User Account Approved',
    description:
      'The user account for Jane Doe has been approved and activated.',
    date: '01/07/2025 09:20 AM',
    unread: false,
    details: {
      type: 'approval',
      table: [{ name: 'Jane Doe', email: 'jane.doe@companydomain.com' }],
      message: 'Jane Doe can now access the system.',
      timeAgo: '1 day ago • 01/07/2025',
      section: 'User Management'
    }
  },
  {
    id: 5,
    title: 'Password Reset Requested',
    description:
      'A password reset was requested for your account. If this was not you, please contact support.',
    date: '01/06/2025 11:00 AM',
    unread: true,
    details: {
      type: 'security',
      table: [],
      message: 'A password reset was initiated for your account.',
      timeAgo: '2 days ago • 01/06/2025',
      section: 'Security'
    }
  },
  {
    id: 6,
    title: 'Order #12345 Has Been Approved',
    description:
      'Your recent order #12345 has been approved and is being processed.',
    date: '01/06/2025 10:20 AM',
    unread: false,
    details: {
      type: 'order',
      table: [{ name: 'Order #12345', email: '' }],
      message: 'Order #12345 is now approved and will be shipped soon.',
      timeAgo: '2 days ago • 01/06/2025',
      section: 'Order Management'
    }
  },
  {
    id: 7,
    title: 'New User Account Created',
    description:
      'A new user account for Michael Lee has been created. Assign roles as needed.',
    date: '01/06/2025 09:20 AM',
    unread: true,
    details: {
      type: 'creation',
      table: [{ name: 'Michael Lee', email: 'michael.lee@companydomain.com' }],
      message:
        'Michael Lee has been added as a new user. Please assign appropriate roles.',
      timeAgo: '2 days ago • 01/06/2025',
      section: 'User Management'
    }
  },
  {
    id: 8,
    title: 'System Maintenance Scheduled',
    description:
      'System maintenance is scheduled for 01/10/2025 from 12:00 AM to 4:00 AM.',
    date: '01/05/2025 08:00 AM',
    unread: false,
    details: {
      type: 'maintenance',
      table: [],
      message:
        'The system will be unavailable during the scheduled maintenance window.',
      timeAgo: '3 days ago • 01/05/2025',
      section: 'System'
    }
  },
  {
    id: 9,
    title: 'Invoice #98765 Ready for Review',
    description: 'Your invoice #98765 is ready for your review and approval.',
    date: '01/05/2025 07:30 AM',
    unread: true,
    details: {
      type: 'invoice',
      table: [{ name: 'Invoice #98765', email: '' }],
      message: 'Please review and approve invoice #98765.',
      timeAgo: '3 days ago • 01/05/2025',
      section: 'Billing'
    }
  },
  {
    id: 10,
    title: 'User Role Updated',
    description:
      'The role for user Sarah Connor has been updated to Administrator.',
    date: '01/04/2025 03:15 PM',
    unread: false,
    details: {
      type: 'role-update',
      table: [
        { name: 'Sarah Connor', email: 'sarah.connor@companydomain.com' }
      ],
      message: 'Sarah Connor is now an Administrator.',
      timeAgo: '4 days ago • 01/04/2025',
      section: 'User Management'
    }
  },
  {
    id: 11,
    title: 'Failed Login Attempt',
    description: 'There was a failed login attempt on your account.',
    date: '01/04/2025 01:00 PM',
    unread: true,
    details: {
      type: 'security',
      table: [],
      message: 'A failed login attempt was detected on your account.',
      timeAgo: '4 days ago • 01/04/2025',
      section: 'Security'
    }
  },
  {
    id: 12,
    title: 'Subscription Renewal Reminder',
    description: 'Your subscription will renew automatically on 01/15/2025.',
    date: '01/03/2025 09:00 AM',
    unread: false,
    details: {
      type: 'reminder',
      table: [],
      message: 'Your subscription is set to renew soon.',
      timeAgo: '5 days ago • 01/03/2025',
      section: 'Billing'
    }
  },
  {
    id: 13,
    title: 'Document Uploaded',
    description: 'A new document has been uploaded to your organization.',
    date: '01/02/2025 04:45 PM',
    unread: true,
    details: {
      type: 'document',
      table: [{ name: 'Policy Update.pdf', email: '' }],
      message: 'A new document is available for review.',
      timeAgo: '6 days ago • 01/02/2025',
      section: 'Documents'
    }
  },
  {
    id: 14,
    title: 'Payment Received',
    description: 'A payment of $1,200 has been received for invoice #98765.',
    date: '01/02/2025 02:30 PM',
    unread: false,
    details: {
      type: 'payment',
      table: [{ name: 'Invoice #98765', email: '' }],
      message: 'Payment received and applied to your account.',
      timeAgo: '6 days ago • 01/02/2025',
      section: 'Billing'
    }
  },
  {
    id: 15,
    title: 'Account Locked',
    description:
      'Your account has been locked due to multiple failed login attempts.',
    date: '01/01/2025 11:00 PM',
    unread: true,
    details: {
      type: 'security',
      table: [],
      message: 'Please contact support to unlock your account.',
      timeAgo: '7 days ago • 01/01/2025',
      section: 'Security'
    }
  }
];

const initialFilterState = {
  notificationDateRange: ['', ''],
  notificationDropdownValue: ''
};

const Notifications = () => {
  const intl = useIntl();

  const [notificationsCount] = useState(notificationsMock.length);

  const onBackTo = () => {
    window.history.back();
  };

  const [dateRange, setDateRange] = useState(
    initialFilterState.notificationDateRange
  );
  const [dropdownValue, setDropdownValue] = useState(
    initialFilterState.notificationDropdownValue
  );
  const [selectedNotification, setSelectedNotification] = useState(
    notificationsMock[0]
  );
  const dropdownOptions = [
    { label: 'All', value: 'all' },
    { label: 'Unread', value: 'unread' },
    { label: 'Read', value: 'read' }
  ];

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <div className="notifications-container">
          <div className="top-nav">
            <Button
              className="back-button-control"
              variant="tertiary"
              Icon={IconArrowLeft}
              onClick={onBackTo}
              size="md">
              {intl.formatMessage({ id: 'notifications.cta.back' })}
            </Button>
          </div>
          <div className="notifications-header">
            <div className="heading">
              <Heading as="h1" size={'var(--brand-font-size--28, 28px)'}>
                {intl.formatMessage({ id: 'notifications.title' })}{' '}
                <span className="count">({notificationsCount})</span>
              </Heading>
            </div>
            <FilterToolbar
              dateRange={dateRange}
              setDateRange={setDateRange}
              dropdownValue={dropdownValue}
              setDropdownValue={setDropdownValue}
              dropdownOptions={dropdownOptions}
              onApply={() => {
                console.log('Sort Icon Clicked');
              }}
              intl={intl}
            />
          </div>
          <div className="notifications-info">
            <Alert
              description={intl.formatMessage({
                id: 'notifications.info.cleared'
              })}
              onClose={() => {}}
              showCloseIcon={false}
              title=""
            />
          </div>
          <div className="notifications-content">
            <div className="notifications-list">
              <NotificationLister
                notifications={notificationsMock}
                selectedNotification={selectedNotification}
                setSelectedNotification={setSelectedNotification}
              />
            </div>
            <div className="notification-detail">
              <NotificationViewer notification={selectedNotification} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
