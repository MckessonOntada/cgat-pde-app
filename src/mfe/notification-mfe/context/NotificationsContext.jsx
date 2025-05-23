import React, { createContext, useContext, useEffect, useState } from 'react';
import { MockNotifications as notificationsMock } from '../data/MockNotifications';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { useQuery } from 'react-query';
import dayjs from 'dayjs';
import { serializeParams } from '@src/util/ApiUtils';
import { useMutation } from 'react-query';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

const initialFilterState = {
  notificationDateRange: [dayjs().subtract(90, 'day').format('MM/DD/YYYY'), dayjs().format('MM/DD/YYYY')],
  notificationCategory: 'all'
};

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [overallNotificationsCount, setOverallNotificationsCount] = useState(0);
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
      setSelectedNotification(notificationsMock.length > 0 ? notificationsMock[0] : null);
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    //  Set the dropdown options based on the data, use notifications to build options from categories picked from data
    const categoryOptions = Array.from(new Set(notifications.map((n) => n.category))).map((category) => ({
      label: category,
      value: category
    }));
    setDropdownOptions([{ label: 'All', value: 'all' }, ...categoryOptions]);
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
        overallNotificationsCount,
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
