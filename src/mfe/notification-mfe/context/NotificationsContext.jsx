import React, { createContext, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';
import { useLocation } from 'react-router-dom';

import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';
import { NOTIFICATION_DRAWER_PAGE_SIZE as CONST_DRAWER_PAGE_SIZE } from '../constants/NotificationFilterConstants';

/* --------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------*/
// Page size and fetch interval from environment or fallback
const NOTIFICATION_PAGE_SIZE = parseInt(process.env.REACT_APP_NOTIFICATION_PAGE_SIZE, 10) || 10;
const NOTIFICATION_DRAWER_PAGE_SIZE = parseInt(process.env.REACT_APP_NOTIFICATION_DRAWER_PAGE_SIZE, 10) || 8;
const NOTIFICATION_FETCH_TIME_IN_MINS = parseInt(process.env.REACT_APP_NOTIFICATION_FETCH_TIME_IN_MINS, 10) || 5;

/* --------------------------------------------------------------------------
 * Context Setup
 * ------------------------------------------------------------------------*/
const NotificationsContext = createContext();
export const useNotifications = () => useContext(NotificationsContext);

/* --------------------------------------------------------------------------
 * Initial State
 * ------------------------------------------------------------------------*/
const initialSearchState = {
  searchText: '',
  notificationDateRange: [
    dayjs().subtract(90, 'day').format('MM/DD/YYYY'),
    dayjs().format('MM/DD/YYYY')
  ],
  notificationCategory: '',
  page: 1,
  pageSize: NOTIFICATION_PAGE_SIZE,
  totalElements: 0,
  totalPages: 0
};

/* --------------------------------------------------------------------------
 * Provider Component
 * ------------------------------------------------------------------------*/
export const NotificationsProvider = ({ children }) => {
  /* ----------------------------- State Variables ----------------------------- */
  // Notifications data
  const [notifications, setNotifications] = useState([]);
  const [drawerNotifications, setDrawerNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Loading states
  const [loadingDrawerNotifications, setLoadingDrawerNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingMoreNotifications, setLoadingMoreNotifications] = useState(false);

  // Unread counts
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerUnreadCount, setDrawerUnreadCount] = useState(0);
  const [filteredUnreadCount, setFilteredUnreadCount] = useState(0);

  // Drawer open/close
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Search/filter state
  const [searchState, setSearchState] = useState(initialSearchState);

  /* ----------------------------- Custom Hooks ----------------------------- */
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const location = useLocation();
  const isNotificationsPage = location.pathname.includes('/notifications');

  /* --------------------------------------------------------------------------
   * Mutations (API Calls)
   * ------------------------------------------------------------------------*/

  // 1. Fetch unread notifications count (global)
  const unreadCountMutation = useMutation(
    async (searchObj) => {
      const payload = {
        searchText: searchObj?.searchText || initialSearchState.searchText,
        category: searchObj?.category || initialSearchState.notificationCategory,
        startDate: searchObj?.startDate || dayjs().subtract(90, 'day').format('YYYY-MM-DD'),
        endDate: searchObj?.endDate || dayjs().format('YYYY-MM-DD')
      };
      return await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS_UNREAD_COUNT(), httpVerb.POST, payload);
    },
    {
      onSuccess: (response) =>
        response.status === 200
          ? setUnreadCount(response?.data?.unreadCount ?? 0)
          : setUnreadCount(0),
      onError: () => {
        setUnreadCount(0);
        showSnackbar({ description: t('notifications.error'), type: 'error' });
      }
    }
  );

  // 2. Fetch unread notifications count (filtered)
  const filteredUnreadCountMutation = useMutation(
    async (searchObj) => {
      const payload = {
        searchText: searchObj?.searchText,
        category: searchObj?.category,
        startDate: dayjs(searchObj?.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(searchObj?.endDate).format('YYYY-MM-DD')
      };
      return await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS_UNREAD_COUNT(), httpVerb.POST, payload);
    },
    {
      onSuccess: (response) =>
        response.status === 200
          ? setFilteredUnreadCount(response?.data?.unreadCount ?? 0)
          : setFilteredUnreadCount(0),
      onError: () => {
        setFilteredUnreadCount(0);
        showSnackbar({ description: t('notifications.error'), type: 'error' });
      }
    }
  );

  // 3. Fetch notifications for the drawer
  const drawerNotificationsMutation = useMutation(
    async (searchObj) => {
      if (notificationDrawerOpen) setLoadingDrawerNotifications(true);
      const payload = {
        searchText: searchObj?.searchText,
        category: searchObj?.category,
        startDate: dayjs(searchObj?.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(searchObj?.endDate).format('YYYY-MM-DD')
      };
      const paramsObj = {
        pageNo: searchObj?.page - 1,
        pageSize: searchObj?.pageSize
      };
      return await HttpResourceService.callRest(
        `${ApiRoutes.NOTIFICATIONS()}?${serializeParams(paramsObj)}`,
        httpVerb.POST,
        payload
      );
    },
    {
      onSuccess: (response) => {
        if (notificationDrawerOpen) {
          setLoadingDrawerNotifications(false);
          if (response.status === 200) {
            const notificationsData = response?.data?.response || [];
            setDrawerNotifications(notificationsData);
            setDrawerUnreadCount(notificationsData.filter((n) => !n.readStatus).length);
          }
        }
      },
      onError: (error) => {
        if (notificationDrawerOpen) {
          setLoadingDrawerNotifications(false);
          setDrawerNotifications([]);
          setDrawerUnreadCount(0);
          error &&
            showSnackbar({ description: t('notifications.error'), type: 'error' });
        }
      }
    }
  );

  // 4. Fetch paginated notifications (main page)
  const notificationsMutation = useMutation(
    async (searchObj) => {
      if (searchState.page === initialSearchState.page) setLoadingNotifications(true);
      else setLoadingMoreNotifications(true);

      const payload = {
        searchText: searchObj.searchText,
        category: searchObj.category,
        startDate: dayjs(searchObj.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(searchObj.endDate).format('YYYY-MM-DD')
      };
      const paramsObj = {
        pageNo: searchObj.page - 1,
        pageSize: searchObj.pageSize
      };
      return await HttpResourceService.callRest(
        `${ApiRoutes.NOTIFICATIONS()}?${serializeParams(paramsObj)}`,
        httpVerb.POST,
        payload
      );
    },
    {
      onSuccess: (response) => {
        if (searchState.page === initialSearchState.page) setLoadingNotifications(false);
        else setLoadingMoreNotifications(false);

        if (response.status === 200) {
          const notifications = response.data.response;
          if (notifications.length > 0) {
            setNotifications((prev) =>
              searchState.page > 1 ? [...prev, ...notifications] : notifications
            );
          } else {
            setNotifications([]);
          }
          setSearchState((prevState) => ({
            ...prevState,
            totalElements: response.data.totalRecords,
            totalPages: response.data.totalPageCount
          }));
        }
      },
      onError: (error) => {
        if (searchState.page === initialSearchState.page) setLoadingNotifications(false);
        else setLoadingMoreNotifications(false);

        setNotifications([]);
        setSelectedNotification(null);
        error &&
          showSnackbar({ description: t('notifications.error'), type: 'error' });
      }
    }
  );

  // 5. Mark all notifications as read
  const markAllNotificationsAsReadMutation = useMutation(
    async (searchObj) => {
      const payload = {
        searchText: searchObj?.searchText,
        category: searchObj?.category,
        startDate: dayjs(searchObj?.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(searchObj?.endDate).format('YYYY-MM-DD')
      };
      return await HttpResourceService.callRest(
        ApiRoutes.NOTIFICATIONS_READ_ALL(),
        httpVerb.PATCH,
        payload
      );
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          showSnackbar({ description: t('notifications.markAllReadSuccess'), type: 'success' });

          // Update all notifications to reflect read status
          notificationDrawerOpen &&
            setDrawerNotifications((prev) =>
              prev.map((notification) => ({ ...notification, readStatus: true }))
            );
          setDrawerUnreadCount(0);
          setUnreadCount(0);
          isNotificationsPage && setFilteredUnreadCount(0);

          // Refetch unread counts
          unreadCountMutation.mutate({
            searchText: initialSearchState.searchText,
            category: initialSearchState.notificationCategory,
            startDate: dayjs().subtract(90, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD')
          });
          isNotificationsPage &&
            filteredUnreadCountMutation.mutate({
              searchText: searchState.searchText,
              category: searchState.notificationCategory,
              startDate: dayjs(searchState.notificationDateRange[0], 'MM/DD/YYYY').format('YYYY-MM-DD'),
              endDate: dayjs(searchState.notificationDateRange[1], 'MM/DD/YYYY').format('YYYY-MM-DD')
            });
          isNotificationsPage &&
            setNotifications((prev) =>
              prev.map((notification) => ({ ...notification, readStatus: true }))
            );
        }
      },
      onError: () => {
        showSnackbar({ description: t('notifications.markAllReadError'), type: 'error' });
      }
    }
  );

  // 6. Mark a single notification as read by ID
  const markNotificationAsReadMutation = useMutation(
    async (notificationId) => {
      return await HttpResourceService.callRest(
        ApiRoutes.NOTIFICATIONS_READ_BY_ID(notificationId),
        httpVerb.PATCH
      );
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          setNotifications((prev) =>
            prev.map((notification) =>
              notification.id === selectedNotification.id
                ? { ...notification, readStatus: true }
                : notification
            )
          );
          setDrawerNotifications((prev) =>
            prev.map((notification) =>
              notification.id === selectedNotification.id
                ? { ...notification, readStatus: true }
                : notification
            )
          );
          setSelectedNotification((prev) => ({
            ...prev,
            readStatus: true
          }));

          // Refetch unread counts
          unreadCountMutation.mutate({
            searchText: initialSearchState.searchText,
            category: initialSearchState.notificationCategory,
            startDate: dayjs().subtract(90, 'day').format('YYYY-MM-DD'),
            endDate: dayjs().format('YYYY-MM-DD')
          });
          isNotificationsPage &&
            filteredUnreadCountMutation.mutate({
              searchText: searchState.searchText,
              category: searchState.notificationCategory,
              startDate: dayjs(searchState.notificationDateRange[0], 'MM/DD/YYYY').format('YYYY-MM-DD'),
              endDate: dayjs(searchState.notificationDateRange[1], 'MM/DD/YYYY').format('YYYY-MM-DD')
            });
        }
      },
      onError: () => {
        showSnackbar({ description: t('notifications.markReadError'), type: 'error' });
      }
    }
  );

  /* --------------------------------------------------------------------------
   * Effects
   * ------------------------------------------------------------------------*/

  // Fetch unread count on mount and every X minutes
  useEffect(() => {
    const searchObj = {
      searchText: initialSearchState.searchText,
      category: initialSearchState.notificationCategory,
      startDate: dayjs().subtract(90, 'day').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD')
    };
    unreadCountMutation.mutate(searchObj);
    const interval = setInterval(() => {
      unreadCountMutation.mutate(searchObj);
    }, NOTIFICATION_FETCH_TIME_IN_MINS * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch drawer notifications when drawer opens
  useEffect(() => {
    if (notificationDrawerOpen) {
      const searchObj = {
        searchText: initialSearchState.searchText,
        category: initialSearchState.notificationCategory,
        startDate: dayjs().subtract(90, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        page: initialSearchState.page,
        pageSize: NOTIFICATION_DRAWER_PAGE_SIZE
      };
      drawerNotificationsMutation.mutate(searchObj);
    } else {
      setDrawerNotifications([]);
      setDrawerUnreadCount(0);
    }
  }, [notificationDrawerOpen]);

  // Fetch notifications when page changes (pagination)
  useEffect(() => {
    if (isNotificationsPage && searchState.page > initialSearchState.page) {
      fetchNotifications();
    }
  }, [searchState.page]);

  // Fetch notifications and filtered unread count when filters change
  useEffect(() => {
    if (isNotificationsPage && JSON.stringify(searchState) !== JSON.stringify(initialSearchState)) {
      fetchNotifications();
      filteredUnreadCountMutation.mutate({
        searchText: searchState.searchText,
        category: searchState.notificationCategory,
        startDate: dayjs(searchState.notificationDateRange[0], 'MM/DD/YYYY').format('YYYY-MM-DD'),
        endDate: dayjs(searchState.notificationDateRange[1], 'MM/DD/YYYY').format('YYYY-MM-DD')
      });
    }
  }, [searchState.searchText, searchState.notificationCategory, searchState.notificationDateRange]);

  // Reset selected notification when leaving notifications page
  useEffect(() => {
    if (!isNotificationsPage) {
      setSelectedNotification(null);
    } else {
      const searchObj = {
        searchText: searchState.searchText,
        category: searchState.notificationCategory,
        startDate: dayjs(searchState.notificationDateRange[0], 'MM/DD/YYYY').format('YYYY-MM-DD'),
        endDate: dayjs(searchState.notificationDateRange[1], 'MM/DD/YYYY').format('YYYY-MM-DD')
      };
      filteredUnreadCountMutation.mutate(searchObj);
    }
  }, [isNotificationsPage]);

  // Mark notification as read when selected
  useEffect(() => {
    if (selectedNotification && selectedNotification.id && !selectedNotification.readStatus) {
      markNotificationAsReadById(selectedNotification.id);
    }
  }, [selectedNotification]);

  /* --------------------------------------------------------------------------
   * Actions & Helpers
   * ------------------------------------------------------------------------*/

  // Fetch notifications (main page)
  const fetchNotifications = () => {
    if (!isNotificationsPage) return;
    const searchObj = {
      searchText: searchState.searchText,
      category: searchState.notificationCategory,
      startDate: dayjs(searchState.notificationDateRange[0], 'MM/DD/YYYY').format('YYYY-MM-DD'),
      endDate: dayjs(searchState.notificationDateRange[1], 'MM/DD/YYYY').format('YYYY-MM-DD'),
      page: searchState.page,
      pageSize: searchState.pageSize
    };
    notificationsMutation.mutate(searchObj);
  };

  // Load more notifications (pagination)
  const loadMoreNotifications = () => {
    if (!notificationDrawerOpen && isNotificationsPage && searchState.page < searchState.totalPages) {
      setSearchState((prevState) => ({
        ...prevState,
        page: prevState.page + 1
      }));
    }
  };

  // Apply filters and reset page
  const applyFilters = (newSearchState) => {
    setSelectedNotification(null);
    setSearchState((prevState) => ({
      ...prevState,
      ...newSearchState,
      page: 1
    }));
  };

  // Reset search state to initial
  const resetSearchState = () => {
    setSearchState(initialSearchState);
  };

  // Mark all notifications as read (calls mutation)
  const markAllNotificationsAsRead = () => {
    const searchObj = {
      searchText: !notificationDrawerOpen ? searchState.searchText : '',
      category: !notificationDrawerOpen ? searchState.notificationCategory : '',
      startDate: !notificationDrawerOpen
        ? dayjs(searchState.notificationDateRange[0], 'MM/DD/YYYY').format('YYYY-MM-DD')
        : dayjs().format('YYYY-MM-DD'),
      endDate: !notificationDrawerOpen
        ? dayjs(searchState.notificationDateRange[1], 'MM/DD/YYYY').format('YYYY-MM-DD')
        : dayjs().subtract(90, 'day').format('YYYY-MM-DD')
    };
    markAllNotificationsAsReadMutation.mutate(searchObj);
  };

  // Mark a notification as read by ID (calls mutation)
  const markNotificationAsReadById = (notificationId) => {
    markNotificationAsReadMutation.mutate(notificationId);
  };

  /* --------------------------------------------------------------------------
   * Provider Value
   * ------------------------------------------------------------------------*/
  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        drawerNotifications,
        setDrawerNotifications,
        selectedNotification,
        setSelectedNotification,
        loadingDrawerNotifications,
        setLoadingDrawerNotifications,
        loadingNotifications,
        setLoadingNotifications,
        loadingMoreNotifications,
        setLoadingMoreNotifications,
        unreadCount,
        setUnreadCount,
        drawerUnreadCount,
        setDrawerUnreadCount,
        filteredUnreadCount,
        setFilteredUnreadCount,
        notificationDrawerOpen,
        setNotificationDrawerOpen,
        searchState,
        setSearchState,
        resetSearchState,
        fetchNotifications,
        loadMoreNotifications,
        isNotificationsPage,
        applyFilters,
        markAllNotificationsAsRead,
        markNotificationAsReadById
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};
