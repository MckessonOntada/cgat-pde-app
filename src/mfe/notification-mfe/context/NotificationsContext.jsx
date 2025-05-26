import React, { createContext, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';

import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';
import { NOTIFICATION_DRAWER_PAGE_SIZE } from '../constants/NotificationFilterConstants';
import { useLocation } from 'react-router-dom';

const NotificationsContext = createContext();
export const useNotifications = () => useContext(NotificationsContext);

const initialSearchState = {
  searchText: '',
  notificationDateRange: [dayjs().subtract(90, 'day').format('MM/DD/YYYY'), dayjs().format('MM/DD/YYYY')],
  notificationCategory: '',
  page: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 0
};

export const NotificationsProvider = ({ children }) => {
  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [drawerNotifications, setDrawerNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loadingDrawerNotifications, setLoadingDrawerNotifications] = useState(false);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingMoreNotifications, setLoadingMoreNotifications] = useState(false);

  // Unread Count State
  const [unreadCount, setUnreadCount] = useState(0); // Total unread notifications count
  const [drawerUnreadCount, setDrawerUnreadCount] = useState(0); // Unread count for drawer notifications
  const [filteredUnreadCount, setFilteredUnreadCount] = useState(0); // Unread count after applying filters

  // Drawer State
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Search State (merged filter + pagination)
  const [searchState, setSearchState] = useState(initialSearchState);

  /* --------------------------------------------------------------------------
   * Hooks
   * ------------------------------------------------------------------------*/
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const location = useLocation();
  const isNotificationsPage = location.pathname.includes('/notifications');

  /* --------------------------------------------------------------------------
   * Mutations (API Calls)
   * ------------------------------------------------------------------------*/

  // Fetch unread notifications count
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
      onSuccess: (response) => (response.status === 200 ? setUnreadCount(response?.data?.unreadCount ?? 0) : setUnreadCount(0)),
      onError: () => {
        setUnreadCount(0);
        showSnackbar({
          description: t('notifications.error'),
          type: 'error'
        });
      }
    }
  );

  // Fetch filtered unread notifications count
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
      onSuccess: (response) => (response.status === 200 ? setFilteredUnreadCount(response?.data?.unreadCount ?? 0) : setFilteredUnreadCount(0)),
      onError: () => {
        setFilteredUnreadCount(0);
        showSnackbar({
          description: t('notifications.error'),
          type: 'error'
        });
      }
    }
  );

  // Fetch unread count on context load and every 5 minutes
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
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Fetch drawer notifications
  const drawerNotificationsMutation = useMutation(
    async (searchObj) => {
      // Set loading states
      if (notificationDrawerOpen) {
        setLoadingDrawerNotifications(true);
      }
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
      return await HttpResourceService.callRest(`${ApiRoutes.NOTIFICATIONS()}?${serializeParams(paramsObj)}`, httpVerb.POST, payload);
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
            showSnackbar({
              description: t('notifications.error'),
              type: 'error'
            });
        }
      }
    }
  );

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

  // Fetch paginated notifications
  const notificationsMutation = useMutation(
    async (searchObj) => {
      // Set loading states
      if (searchState.page === initialSearchState.page) {
        setLoadingNotifications(true);
      } else {
        setLoadingMoreNotifications(true);
      }
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
      return await HttpResourceService.callRest(`${ApiRoutes.NOTIFICATIONS()}?${serializeParams(paramsObj)}`, httpVerb.POST, payload);
    },
    {
      onSuccess: (response) => {
        if (searchState.page === initialSearchState.page) {
          setLoadingNotifications(false);
        } else {
          setLoadingMoreNotifications(false);
        }
        if (response.status === 200) {
          const notifications = response.data.response;
          if (notifications.length > 0) {
            setNotifications((prev) => (searchState.page > 1 ? [...prev, ...notifications] : notifications));
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
        if (searchState.page === initialSearchState.page) {
          setLoadingNotifications(false);
        } else {
          setLoadingMoreNotifications(false);
        }
        setNotifications([]);
        setSelectedNotification(null);
        error &&
          showSnackbar({
            description: t('notifications.error'),
            type: 'error'
          });
      }
    }
  );

  const fetchNotifications = () => {
    if (!isNotificationsPage) {
      return; // Do not fetch if not on notifications page
    }
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

  useEffect(() => {
    if (isNotificationsPage && searchState.page > initialSearchState.page) {
      fetchNotifications();
    }
  }, [searchState.page]);

  useEffect(() => {
    if (isNotificationsPage && JSON.stringify(searchState) !== JSON.stringify(initialSearchState)) {
      // Fetch notifications when search state changes
      fetchNotifications();
      filteredUnreadCountMutation.mutate({
        searchText: searchState.searchText,
        category: searchState.notificationCategory,
        startDate: dayjs(searchState.notificationDateRange[0], 'MM/DD/YYYY').format('YYYY-MM-DD'),
        endDate: dayjs(searchState.notificationDateRange[1], 'MM/DD/YYYY').format('YYYY-MM-DD')
      });
    }
  }, [searchState.searchText, searchState.notificationCategory, searchState.notificationDateRange]);

  const applyFilters = (newSearchState) => {
    setSelectedNotification(null); // Reset selected notification when applying filters
    // Reset page to 1 when applying filters
    setSearchState((prevState) => ({
      ...prevState,
      ...newSearchState,
      page: 1 // Reset page to 1 when applying filters
    }));
  };

  // Reset search state to initial
  const resetSearchState = () => {
    setSearchState(initialSearchState);
  };

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

  // Mark all notifications as read
  const markAllNotificationsAsReadMutation = useMutation(
    async (searchObj) => {
      const payload = {
        searchText: searchObj?.searchText,
        category: searchObj?.category,
        startDate: dayjs(searchObj?.startDate).format('YYYY-MM-DD'),
        endDate: dayjs(searchObj?.endDate).format('YYYY-MM-DD')
      };
      return await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS_READ_ALL(), httpVerb.PATCH, payload);
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          showSnackbar({
            description: t('notifications.markAllReadSuccess'),
            type: 'success'
          });
          // Update all notifications to reflect read status

          notificationDrawerOpen &&
            setDrawerNotifications((prev) =>
              prev.map((notification) => ({
                ...notification,
                readStatus: true
              }))
            );
          setDrawerUnreadCount(0); // Reset drawer unread count
          setUnreadCount(0); // Reset total unread count
          isNotificationsPage && setFilteredUnreadCount(0);
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
              prev.map((notification) => ({
                ...notification,
                readStatus: true
              }))
            );
        }
      },
      onError: () => {
        showSnackbar({
          description: t('notifications.markAllReadError'),
          type: 'error'
        });
      }
    }
  );

  // Mark a single notification as read by ID
  const markNotificationAsReadMutation = useMutation(
    async (notificationId) => {
      return await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS_READ_BY_ID(notificationId), httpVerb.PATCH);
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          // Update notificaion list to reflect read status
          setNotifications((prev) =>
            prev.map((notification) => (notification.id === selectedNotification.id ? { ...notification, readStatus: true } : notification))
          );
          setDrawerNotifications((prev) =>
            prev.map((notification) => (notification.id === selectedNotification.id ? { ...notification, readStatus: true } : notification))
          );
          // Update the selected notification to reflect read status
          setSelectedNotification((prev) => ({
            ...prev,
            readStatus: true
          }));
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
        showSnackbar({
          description: t('notifications.markReadError'),
          type: 'error'
        });
      }
    }
  );

  // Mark all notifications as read (calls mutation)
  const markAllNotificationsAsRead = () => {
    const searchObj = {
      searchText: !notificationDrawerOpen ? searchState.searchText : '',
      category: !notificationDrawerOpen ? searchState.notificationCategory : '',
      startDate: !notificationDrawerOpen ? dayjs(searchState.notificationDateRange[0], 'MM/DD/YYYY').format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
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

  // Mark notification as read when selected
  useEffect(() => {
    if (selectedNotification && selectedNotification.id && !selectedNotification.readStatus) {
      markNotificationAsReadById(selectedNotification.id);
    }
  }, [selectedNotification]);

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
