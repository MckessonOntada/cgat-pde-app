export const MockNotifications = [
  {
    id: 1,
    title: 'Reminder: Pending User Approval Requests - Please Review and Take Action Promptly',
    description: 'You have pending user registration requests awaiting approval.',
    date: '05/20/2025 10:20 PM',
    unread: true,
    section: 'User Management',
    content:
      '<style>\n      .notif-user-details-container {\n        width: 100%;\n        height: 100%;\n        flex-direction: column;\n        justify-content: flex-start;\n        align-items: flex-start;\n        gap: 16px;\n        display: inline-flex;\n      }\n      .notif-user-details-title {\n        width: 258px;\n        color: var(--text-body-01-default, #1E394E);\n        font-size: 16px;\n        font-family: Nunito;\n        font-weight: 600;\n        line-height: 20px;\n        word-wrap: break-word;\n      }\n      .notif-user-details-row {\n        justify-content: flex-start;\n        align-items: flex-start;\n        gap: 24px;\n        display: flex;\n        flex-wrap: wrap;\n      }\n      .notif-user-details-col {\n        width: 275px;\n        flex-direction: column;\n        justify-content: flex-start;\n        align-items: flex-start;\n        gap: 4px;\n        display: inline-flex;\n      }\n      .notif-user-details-label {\n        align-self: stretch;\n        color: var(--text-body-01---default, #1E394E);\n        font-size: 14px;\n        font-family: Nunito;\n        font-weight: 400;\n        line-height: 18px;\n        word-wrap: break-word;\n      }\n      .notif-user-details-value {\n        align-self: stretch;\n        color: #1E394E;\n        font-size: 16px;\n        font-family: Nunito;\n        font-weight: 600;\n        line-height: 20px;\n        word-wrap: break-word;\n      }\n    </style>\n    <div class="notif-user-details-container">\n      <div class="notif-user-details-title">User Details</div>\n      <div class="notif-user-details-row">\n        <div class="notif-user-details-col">\n          <div class="notif-user-details-label">Name</div>\n          <div class="notif-user-details-value">Adam Cuma</div>\n        </div>\n        <div class="notif-user-details-col">\n          <div class="notif-user-details-label">Email</div>\n          <div class="notif-user-details-value">john.smith@companydomain.com</div>\n        </div>\n        <div class="notif-user-details-col">\n          <div class="notif-user-details-label">Requested On</div>\n          <div class="notif-user-details-value">01/08/2025 10:20 PM</div>\n        </div>\n      </div>\n    </div>'
  },
  {
    id: 2,
    title: 'New Organization Created',
    description: 'A new organization, Acme Health, has been created and is now active.',
    date: '05/20/2025 11:00 AM',
    unread: true,
    section: 'Order Approval',
    content:
      '<style>\n      .notif-order-details-container {\n        width: 100%;\n        height: 100%;\n        flex-direction: column;\n        justify-content: flex-start;\n        align-items: flex-start;\n        gap: 16px;\n        display: inline-flex;\n      }\n      .notif-order-details-title {\n        width: 258px;\n        color: var(--text-body-01-default, #1E394E);\n        font-size: 16px;\n        font-family: Nunito;\n        font-weight: 600;\n        line-height: 20px;\n        word-wrap: break-word;\n      }\n      .notif-order-details-main {\n        width: 100%;\n        min-width: 0;\n        display: flex;\n        flex-wrap: wrap;\n        gap: 24px 24px;\n        position: relative;\n      }\n      .notif-order-details-col {\n        width: 275px;\n        flex-direction: column;\n        justify-content: flex-start;\n        align-items: flex-start;\n        gap: 4px;\n        display: flex;\n        position: static;\n      }\n      /* Remove absolute positioning for wrapping */\n      .notif-order-details-col.order-id {}\n      .notif-order-details-col.therapy-name { width: 274px; }\n      .notif-order-details-col.order-date {}\n      .notif-order-details-col.rejection-reason {}\n      .notif-order-details-col.status { width: 274px; }\n      .notif-order-details-label {\n        align-self: stretch;\n        color: var(--text-body-01---default, #1E394E);\n        font-size: 14px;\n        font-family: Nunito;\n        font-weight: 400;\n        line-height: 18px;\n        word-wrap: break-word;\n      }\n      .notif-order-details-value {\n        align-self: stretch;\n        color: #1E394E;\n        font-size: 16px;\n        font-family: Nunito;\n        font-weight: 600;\n        line-height: 20px;\n        word-wrap: break-word;\n      }\n      .notif-order-details-col.order-id { left: 0px; top: 0px; }\n      .notif-order-details-col.therapy-name { width: 274px; left: 298.67px; top: 0px; }\n      .notif-order-details-col.order-date { left: 597.33px; top: 0px; }\n      .notif-order-details-col.rejection-reason { left: 0px; top: 66px; }\n      .notif-order-details-col.status { left: 298.67px; top: 66px; }\n    </style>\n    <div class="notif-order-details-container">\n      <div class="notif-order-details-title">Order Details</div>\n      <div class="notif-order-details-main">\n        <div class="notif-order-details-col order-id">\n          <div class="notif-order-details-label">Order ID</div>\n          <div class="notif-order-details-value">[Order ID]</div>\n        </div>\n        <div class="notif-order-details-col therapy-name">\n          <div class="notif-order-details-label">Therapy Name</div>\n          <div class="notif-order-details-value">[Therapy Name]</div>\n        </div>\n        <div class="notif-order-details-col order-date">\n          <div class="notif-order-details-label">Order Date</div>\n          <div class="notif-order-details-value">[Order Date]</div>\n        </div>\n        <div class="notif-order-details-col rejection-reason">\n          <div class="notif-order-details-label">Rejection Reason</div>\n          <div class="notif-order-details-value">[Rejection Reason]</div>\n        </div>\n        <div class="notif-order-details-col status">\n          <div class="notif-order-details-label">Status</div>\n          <div class="notif-order-details-value">Rejected</div>\n        </div>\n      </div>\n    </div>'
  },
  {
    id: 3,
    title: 'Welcome to Your System Admin Account',
    description: 'Your system admin account is now active. Please log in to complete your profile setup.',
    date: '05/19/2025 10:20 AM',
    unread: false,
    section: 'On Behalf',
    content:
      '<style>\n      .notif-login-details-container {\n        width: 100%;\n        height: 100%;\n        flex-direction: column;\n        justify-content: flex-start;\n        align-items: flex-start;\n        gap: 16px;\n        display: inline-flex;\n      }\n      .notif-login-details-title {\n        width: 258px;\n        color: var(--text-body-01-default, #1E394E);\n        font-size: 16px;\n        font-family: Nunito;\n        font-weight: 600;\n        line-height: 20px;\n        word-wrap: break-word;\n      }\n      .notif-login-details-main {\n        width: 100%;\n        min-width: 0;\n        display: flex;\n        flex-wrap: wrap;\n        gap: 24px 24px;\n        position: relative;\n      }\n      .notif-login-details-col {\n        width: 275px;\n        flex-direction: column;\n        justify-content: flex-start;\n        align-items: flex-start;\n        gap: 4px;\n        display: flex;\n        position: static;\n      }\n      .notif-login-details-label {\n        align-self: stretch;\n        color: var(--text-body-01---default, #1E394E);\n        font-size: 14px;\n        font-family: Nunito;\n        font-weight: 400;\n        line-height: 18px;\n        word-wrap: break-word;\n      }\n      .notif-login-details-value {\n        align-self: stretch;\n        color: #1E394E;\n        font-size: 16px;\n        font-family: Nunito;\n        font-weight: 600;\n        line-height: 20px;\n        word-wrap: break-word;\n        text-overflow: ellipsis;\n        white-space: nowrap;\n        max-width: 100%;\n      }\n    </style>\n    <div class="notif-login-details-container">\n      <div class="notif-login-details-title">Login Details</div>\n      <div class="notif-login-details-main">\n        <div class="notif-login-details-col">\n          <div class="notif-login-details-label">Admin Name</div>\n          <div class="notif-login-details-value">[Admin Name]</div>\n        </div>\n        <div class="notif-login-details-col" style="width: 274px;">\n          <div class="notif-login-details-label">Date & Time of Login</div>\n          <div class="notif-login-details-value">[Date & Time]</div>\n        </div>\n      </div>\n    </div>'
  },
  {
    id: 4,
    title: 'User Account Approved',
    description: 'The user account for Jane Doe has been approved and activated.',
    date: '05/19/2025 09:20 AM',
    unread: false,
    section: 'User Management',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n    <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">You have orders in pending approval status that require your attention. To review and take necessary action, please visit:</div>\n    <a href="/orders" target="_blank" style="width: 234px; height: 100%; padding-left: 16px; padding-right: 16px; padding-top: 7px; padding-bottom: 7px; background: var(--fill-White, white); border-radius: 6px; outline: 2px var(--fill-primary-cta, #007CC1) solid; outline-offset: -2px; justify-content: center; align-items: center; gap: 6px; display: inline-flex; text-decoration: none;" data-icon="No Icon" data-size="M" data-state="Normal" data-status="Current" data-type="Secondary">\n        <div style="justify-content: center; display: flex; flex-direction: column; color: var(--fill-primary-cta, #007CC1); font-size: 14px; font-family: Nunito; font-weight: 600; text-transform: uppercase; line-height: 18px; letter-spacing: 0.49px; word-wrap: break-word">Pending Approvals page</div>\n    </a>\n</div>'
  },
  {
    id: 5,
    title: 'Password Reset Requested',
    description: 'A password reset was requested for your account. If this was not you, please contact support.',
    date: '05/18/2025 11:00 AM',
    unread: true,
    section: 'User Management',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n  <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">A password reset was requested for your account. If this was not you, please contact support immediately.</div>\n  <div style="align-self: stretch; color: #1E394E; font-size: 14px; font-family: Nunito; font-weight: 400; line-height: 18px; word-wrap: break-word">Date: 01/06/2025 11:00 AM</div>\n</div>'
  },
  {
    id: 6,
    title: 'Order #12345 Has Been Approved',
    description: 'Your recent order #12345 has been approved and is being processed.',
    date: '05/18/2025 10:20 AM',
    unread: false,
    section: 'Order Approval',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n  <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">Order #12345 has been approved and is being processed.</div>\n  <div style="align-self: stretch; color: #1E394E; font-size: 14px; font-family: Nunito; font-weight: 400; line-height: 18px; word-wrap: break-word">Order Date: 01/06/2025 10:20 AM</div>\n</div>'
  },
  {
    id: 7,
    title: 'New User Account Created',
    description: 'A new user account for Michael Lee has been created. Assign roles as needed.',
    date: '05/18/2025 09:20 AM',
    unread: true,
    section: 'User Management',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n  <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">A new user account for Michael Lee has been created. Please assign appropriate roles.</div>\n  <div style="align-self: stretch; color: #1E394E; font-size: 14px; font-family: Nunito; font-weight: 400; line-height: 18px; word-wrap: break-word">Created On: 01/06/2025 09:20 AM</div>\n</div>'
  },
  {
    id: 8,
    title: 'System Maintenance Scheduled',
    description: 'System maintenance is scheduled for 01/10/2025 from 12:00 AM to 4:00 AM.',
    date: '05/17/2025 08:00 AM',
    unread: false,
    section: 'On Behalf',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n  <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">System maintenance is scheduled for 01/10/2025 from 12:00 AM to 4:00 AM. Please save your work accordingly.</div>\n</div>'
  },
  {
    id: 9,
    title: 'Invoice #98765 Ready for Review',
    description: 'Your invoice #98765 is ready for your review and approval.',
    date: '05/17/2025 07:30 AM',
    unread: true,
    section: 'Order Approval',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n  <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">Invoice #98765 is ready for your review and approval.</div>\n  <div style="align-self: stretch; color: #1E394E; font-size: 14px; font-family: Nunito; font-weight: 400; line-height: 18px; word-wrap: break-word">Date: 01/05/2025 07:30 AM</div>\n</div>'
  },
  {
    id: 10,
    title: 'User Role Updated',
    description: 'The role for user Sarah Connor has been updated to Administrator.',
    date: '05/16/2025 03:15 PM',
    unread: false,
    section: 'User Management',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n  <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">The role for user Sarah Connor has been updated to Administrator.</div>\n  <div style="align-self: stretch; color: #1E394E; font-size: 14px; font-family: Nunito; font-weight: 400; line-height: 18px; word-wrap: break-word">Updated On: 01/04/2025 03:15 PM</div>\n</div>'
  },
  {
    id: 11,
    title: 'Failed Login Attempt',
    description: 'There was a failed login attempt on your account.',
    date: '05/16/2025 01:00 PM',
    unread: true,
    section: 'User Management',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n  <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">There was a failed login attempt on your account. If this was not you, please update your password.</div>\n  <div style="align-self: stretch; color: #1E394E; font-size: 14px; font-family: Nunito; font-weight: 400; line-height: 18px; word-wrap: break-word">Date: 01/04/2025 01:00 PM</div>\n</div>'
  },
  {
    id: 12,
    title: 'Subscription Renewal Reminder',
    description: 'Your subscription will renew automatically on 01/15/2025.',
    date: '05/15/2025 09:00 AM',
    unread: false,
    section: 'On Behalf',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n  <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">Your subscription will renew automatically on 01/15/2025.</div>\n</div>'
  },
  {
    id: 13,
    title: 'Document Uploaded',
    description: 'A new document has been uploaded to your organization.',
    date: '05/14/2025 04:45 PM',
    unread: true,
    section: 'Order Approval',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n  <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">A new document has been uploaded to your organization.</div>\n  <div style="align-self: stretch; color: #1E394E; font-size: 14px; font-family: Nunito; font-weight: 400; line-height: 18px; word-wrap: break-word">Uploaded On: 01/02/2025 04:45 PM</div>\n</div>'
  },
  {
    id: 14,
    title: 'Payment Received',
    description: 'A payment of $1,200 has been received for invoice #98765.',
    date: '05/14/2025 02:30 PM',
    unread: false,
    section: 'Order Approval',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n  <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">A payment of $1,200 has been received for invoice #98765.</div>\n  <div style="align-self: stretch; color: #1E394E; font-size: 14px; font-family: Nunito; font-weight: 400; line-height: 18px; word-wrap: break-word">Received On: 01/02/2025 02:30 PM</div>\n</div>'
  },
  {
    id: 15,
    title: 'Account Locked',
    description: 'Your account has been locked due to multiple failed login attempts.',
    date: '05/13/2025 11:00 PM',
    unread: true,
    section: 'User Management',
    content:
      '<div style="width: 100%; height: 100%; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 16px; display: inline-flex">\n  <div style="align-self: stretch; color: var(--text-body-01-default, #1E394E); font-size: 16px; font-family: Nunito; font-weight: 600; line-height: 20px; word-wrap: break-word">Your account has been locked due to multiple failed login attempts. Please contact support to unlock your account.</div>\n  <div style="align-self: stretch; color: #1E394E; font-size: 14px; font-family: Nunito; font-weight: 400; line-height: 18px; word-wrap: break-word">Locked On: 01/01/2025 11:00 PM</div>\n</div>'
  }
];
