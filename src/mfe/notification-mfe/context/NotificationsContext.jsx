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

  // Call POST API to get overall notifications count using react-query, every 5 mins, pass a request payload with initial filter state
  useQuery(
    ['overallNotificationsCount', initialFilterState],
    async () => {
      const response = await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS_UNREAD_COUNT, httpVerb.POST, initialFilterState);
      return response?.data?.count ?? 0;
    },
    {
      onSuccess: (count) => setOverallNotificationsCount(count),
      onError: () => setOverallNotificationsCount(0),
      refetchOnWindowFocus: false,
      refetchInterval: 5 * 60 * 1000 // 5 minutes in milliseconds
    }
  );

  // Call POST API to get notifications using react-query, every 5 mins, pass a request payload with filter state
  useQuery(
    ['notifications', filterState],
    async () => {
      const response = await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS, httpVerb.POST, filterState);
      return response?.data ?? [];
    },
    {
      onSuccess: (data) => {
        setNotifications(data);
        setNotificationsCount(data.filter((notification) => notification.unread).length);
      },
      onError: () => setNotifications([]),
      refetchOnWindowFocus: false,
      refetchInterval: JSON.stringify(filterState) === JSON.stringify(initialFilterState) ? 5 * 60 * 1000 : false
    }
  );

  // Call PATCH API to mark all notifications as read using react-query
  const markAllAsReadMutation = useMutation(
    async () => {
      const response = await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS_READ_ALL, httpVerb.PATCH, {});
      return response?.data ?? [];
    },
    {
      onSuccess: () => {
        markAllNotificationsAsRead();
      },
      onError: () => console.error('Error marking all notifications as read')
    }
  );

  // Call PATCH API to mark notification as read by ID using react-query
  const markAsReadByIdMutation = useMutation(
    async (id) => {
      const response = await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS_READ_BY_ID(id), httpVerb.PATCH, {});
      return response?.data ?? [];
    },
    {
      onSuccess: (_, id) => {
        markNotificationAsReadById(id);
      },
      onError: () => console.error('Error marking notification as read by ID')
    }
  );

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
