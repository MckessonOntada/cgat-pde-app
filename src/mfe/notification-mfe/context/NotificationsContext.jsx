import React, { createContext, useContext, useEffect, useState } from 'react';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);



const initialFilterState = {
  notificationDateRange: ['', ''],
  notificationDropdownValue: ''
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [filterState, setFilterState] = useState(initialFilterState);
  const [dropdownOptions, setDropdownOptions] = useState([]);

  useEffect(() => {
    // Simulate fetching notifications from an API
    const fetchNotifications = () => {
      // Here you would typically make an API call to fetch notifications
      // For this example, we're using the mock data defined above

      setNotifications(notificationsMock);
      setNotificationsCount(notificationsMock.filter((notification) => notification.unread).length);
      // Set the initial state of the notification drawer
      setSelectedNotification(notificationsMock[0]);
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    //  Set the dropdown options based on the data, use notifications to build options from sections picked from data
    const sectionOptions = Array.from(new Set(notifications.map((n) => n.section))).map((section) => ({
      label: section,
      value: section
    }));
    setDropdownOptions([{ label: 'All', value: 'all' }, ...sectionOptions]);
  }, [notifications]);

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      unread: false
    }));
    setNotifications(updatedNotifications);
    setNotificationsCount(updatedNotifications.filter((n) => n.unread).length);
  };

  const markNotificationAsReadById = (id) => {
    const updatedNotifications = notifications.map((notification) => (notification.id === id ? { ...notification, unread: false } : notification));
    setNotifications(updatedNotifications);
    setNotificationsCount(updatedNotifications.filter((n) => n.unread).length);
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        selectedNotification,
        setSelectedNotification,
        notificationsCount,
        setNotificationsCount,
        notificationDrawerOpen,
        setNotificationDrawerOpen,
        filterState,
        setFilterState,
        dropdownOptions,
        markAllNotificationsAsRead,
        markNotificationAsReadById
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};
