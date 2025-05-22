// Replace the URLs with your actual API endpoints
const API_BASE = '/api/notifications';

export const getNotifications = async () => {
  const res = await fetch(`${API_BASE}`);
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
};

export const markNotificationsUnread = async () => {
  const res = await fetch(`${API_BASE}/mark-all-unread`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to mark all notifications as unread');
  return res.json();
};

export const markNotificationsUnreadById = async (id) => {
  const res = await fetch(`${API_BASE}/${id}/mark-unread`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to mark notification as unread');
  return res.json();
};

export const getUnreadNotificationsCount = async () => {
  const res = await fetch(`${API_BASE}/unread-count`);
  if (!res.ok) throw new Error('Failed to fetch unread notifications count');
  return res.json();
};
