/**
 * Notification Filter Constants
 *
 * This file contains constants used for filtering notifications,
 * such as category lists and other filter-related options.
 */

// =========================
// Notification Page Constants
// =========================
export const NOTIFICATION_PAGE_SIZE = parseInt(process.env.REACT_APP_NOTIFICATION_PAGE_SIZE, 10) || 10;
export const NOTIFICATION_DRAWER_PAGE_SIZE = parseInt(process.env.REACT_APP_NOTIFICATION_DRAWER_PAGE_SIZE, 10) || 8;
export const NOTIFICATION_FETCH_TIME_IN_MINS = parseInt(process.env.REACT_APP_NOTIFICATION_FETCH_TIME_IN_MINS, 10) || 5;

// =========================
// Category Filter Options
// =========================

/**
 * List of notification categories for filtering.
 * Each object contains a label (for display) and a value (for logic).
 */
export const NOTIFICATION_CATEGORIES_LIST = [
  { label: 'All', value: 'All' },
  { label: 'User Management', value: 'User Management' },
  { label: 'Order Approval', value: 'Order Approval' },
  { label: 'Order Management', value: 'Order Management' },
  { label: 'On Behalf', value: 'On Behalf' }
];

// =========================
// Read Status Filter Options
// =========================

/**
 * List of notification read status options for filtering.
 * Each object contains a label (for display) and a value (for logic).
 */
export const NOTIFICATION_READ_STATUS_LIST = [
  { label: 'All', value: 'ALL' },
  { label: 'Read', value: 'READ' },
  { label: 'Unread', value: 'UNREAD' }
];

// =========================
// (Add more filter constants below as needed)
// =========================

/*
  Example:
  export const NOTIFICATION_STATUS_LIST = [
    { label: 'Unread', value: 'unread' },
    { label: 'Read', value: 'read' }
  ];
*/
