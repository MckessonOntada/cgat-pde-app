/**
 * Notification Filter Constants
 *
 * This file contains constants used for filtering notifications,
 * such as category lists and other filter-related options.
 */

// =========================
// Notification Page Constants
// =========================
export const NOTIFICATION_DRAWER_PAGE_SIZE = 8; // Number of notifications per page in the drawer
export const NOTIFICATION_LIST_PAGE_SIZE = 10; // Number of notifications per page in the list view

// =========================
// Category Filter Options
// =========================

/**
 * List of notification categories for filtering.
 * Each object contains a label (for display) and a value (for logic).
 */
export const NOTIFICATION_CATEGORIES_LIST = [
  { label: 'All', value: '' },
  { label: 'On Behalf', value: 'On Behalf' },
  { label: 'Order Approval', value: 'Order Approval' },
  { label: 'User Management', value: 'User Management' }
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
