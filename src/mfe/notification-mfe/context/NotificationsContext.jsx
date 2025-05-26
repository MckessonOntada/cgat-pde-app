import React, { createContext, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';

import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';

/* ============================================================================
 * Context and Custom Hook
 * ========================================================================== */
const NotificationsContext = createContext();
export const useNotifications = () => useContext(NotificationsContext);

/* ============================================================================
 * Initial State
 * ========================================================================== */
const initialSearchState = {
  notificationDateRange: [dayjs().subtract(90, 'day').format('MM/DD/YYYY'), dayjs().format('MM/DD/YYYY')],
  notificationCategory: '',
  page: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 0
};

/* ============================================================================
 * Provider Component
 * ========================================================================== */
/**
 * NotificationsProvider component provides notification-related state and actions
 * to its children via React Context. It manages fetching, updating, and marking
 * notifications as read, as well as handling unread counts, pagination and filtering.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components that will have access to the notifications context.
 * @returns {JSX.Element} The NotificationsContext.Provider wrapping the children.
 *
 * @context
 * Provides the following values via context:
 * - unreadCount {number}: Total unread notifications count.
 * - drawerUnreadCount {number}: Unread notifications count for the drawer.
 * - paginatedUnreadCount {number}: Unread notifications count in the current page.
 * - paginatedNotifications {Array}: List of paginated notifications.
 * - selectedNotification {Object|null}: Currently selected notification.
 * - setSelectedNotification {Function}: Setter for selected notification.
 * - loadMoreNotifications {Function}: Loads more notifications (pagination).
 * - loadingNotifications {boolean}: Loading state for notifications.
 * - loadingMoreNotifications {boolean}: Loading state for loading more notifications.
 * - markAllNotificationsAsRead {Function}: Marks all notifications as read.
 * - notificationDrawerOpen {boolean}: State for notification drawer visibility.
 * - setNotificationDrawerOpen {Function}: Setter for notification drawer state.
 * - searchState {Object}: Current search/filter/pagination state.
 * - setSearchState {Function}: Setter for search state.
 * - resetSearchState {Function}: Resets search state to initial values.
 */
export const NotificationsProvider = ({ children }) => {
  /* --------------------------------------------------------------------------
   * State Hooks
   * ------------------------------------------------------------------------*/
  // Notifications State
  const [paginatedNotifications, setPaginatedNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingMoreNotifications, setLoadingMoreNotifications] = useState(false);

  // Unread Count State
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerUnreadCount, setDrawerUnreadCount] = useState(0);
  const [paginatedUnreadCount, setPaginatedUnreadCount] = useState(0);

  // Drawer State
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Search State (merged filter + pagination)
  const [searchState, setSearchState] = useState(initialSearchState);

  /* --------------------------------------------------------------------------
   * Hooks
   * ------------------------------------------------------------------------*/
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslate();

  /* --------------------------------------------------------------------------
   * Mutations (API Calls)
   * ------------------------------------------------------------------------*/

  // Fetch unread notifications count
  const unreadCountMutation = useMutation(
    async () => {
      const payload = {
        searchText: '',
        category: '',
        startDate: '',
        endDate: dayjs().format('YYYY-MM-DD')
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

  // Fetch paginated notifications
  const notificationsMutation = useMutation(
    async () => {
      // Set loading states
      if (searchState.page === initialSearchState.page) {
        setLoadingNotifications(true);
      } else {
        setLoadingMoreNotifications(true);
      }
      const endDateFromFilter = dayjs(searchState.notificationDateRange[1], 'MM/DD/YYYY');
      const now = dayjs();
      const effectiveEndDate = endDateFromFilter.isAfter(now) ? endDateFromFilter : now;

      const payload = {
        searchText: '',
        category: searchState.notificationCategory,
        startDate: dayjs(searchState.notificationDateRange[0], 'MM/DD/YYYY').format('YYYY-MM-DD'),
        endDate: effectiveEndDate.format('YYYY-MM-DD')
      };
      const paramsObj = {
        pageNo: searchState.page - 1,
        pageSize: searchState.pageSize
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
            setPaginatedNotifications((prev) => (searchState.page > 1 ? [...prev, ...notifications] : notifications));
          } else {
            setPaginatedNotifications([]);
          }
          setSearchState((prevState) => ({
            ...prevState,
            totalElements: response.data.totalRecords,
            totalPages: response.data.totalPageCount
          }));
        }
      },
      onError: () => {
        if (searchState.page === initialSearchState.page) {
          setLoadingNotifications(false);
        } else {
          setLoadingMoreNotifications(false);
        }
        setPaginatedNotifications([]);
      }
    }
  );

  // Mark all notifications as read
  const markAllNotificationsAsReadMutation = useMutation(
    async () => {
      return await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS_READ_ALL(), httpVerb.PATCH);
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          showSnackbar({
            description: t('notifications.markAllReadSuccess'),
            type: 'success'
          });
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
          setPaginatedNotifications((prev) =>
            prev.map((notification) => (notification.id === selectedNotification.id ? { ...notification, readStatus: true } : notification))
          );
          // Update the selected notification to reflect read status
          setSelectedNotification((prev) => ({
            ...prev,
            readStatus: true
          }));
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

  /* --------------------------------------------------------------------------
   * Effects
   * ------------------------------------------------------------------------*/

  // Mark notification as read when selected
  useEffect(() => {
    if (selectedNotification && selectedNotification.id && !selectedNotification.readStatus) {
      markNotificationAsReadById(selectedNotification.id);
    }
  }, [selectedNotification]);

  // Fetch unread count on mount and every 5 minutes
  useEffect(() => {
    unreadCountMutation.mutate();
    const interval = setInterval(() => {
      unreadCountMutation.mutate();
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Reset page to 1 when filter changes
  useEffect(() => {
    setSearchState((prev) => ({
      ...prev,
      page: 1
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState.notificationCategory, searchState.notificationDateRange]);

  // Fetch notifications on mount/filter/page change, poll every 5 min if filter is initial
  useEffect(() => {
    notificationsMutation.mutate();
    let interval;
    const isInitialFilter =
      JSON.stringify({
        notificationDateRange: searchState.notificationDateRange,
        notificationCategory: searchState.notificationCategory
      }) ===
      JSON.stringify({
        notificationDateRange: initialSearchState.notificationDateRange,
        notificationCategory: initialSearchState.notificationCategory
      });
    if (isInitialFilter) {
      interval = setInterval(() => {
        notificationsMutation.mutate();
      }, 5 * 60 * 1000); // 5 minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState.notificationCategory, searchState.notificationDateRange, searchState.page, searchState.pageSize]);

  // Update unread counts when notifications change
  useEffect(() => {
    if (paginatedNotifications.length > 0) {
      setPaginatedUnreadCount(paginatedNotifications.filter((notification) => !notification.readStatus).length);
      setDrawerUnreadCount(paginatedNotifications.slice(0, 8).filter((notification) => !notification.readStatus).length);
    } else {
      setSelectedNotification(null);
    }
  }, [paginatedNotifications]);

  /* --------------------------------------------------------------------------
   * Helper Functions
   * ------------------------------------------------------------------------*/

  // Mark all notifications as read (calls mutation)
  const markAllNotificationsAsRead = () => {
    markAllNotificationsAsReadMutation.mutate();
  };

  // Mark a notification as read by ID (calls mutation)
  const markNotificationAsReadById = (notificationId) => {
    markNotificationAsReadMutation.mutate(notificationId);
  };

  // Load more notifications (pagination)
  const loadMoreNotifications = () => {
    if (searchState.page < searchState.totalPages) {
      setSearchState((prevState) => ({
        ...prevState,
        page: prevState.page + 1
      }));
    }
  };

  // Reset search state to initial
  const resetSearchState = () => {
    setSearchState(initialSearchState);
  };

  /* --------------------------------------------------------------------------
   * Provider Value
   * ------------------------------------------------------------------------*/
  return (
    <NotificationsContext.Provider
      value={{
        // Unread Count
        unreadCount,
        drawerUnreadCount,
        paginatedUnreadCount,

        // Notifications
        paginatedNotifications,
        selectedNotification,
        setSelectedNotification,
        loadMoreNotifications,
        loadingNotifications,
        loadingMoreNotifications,

        // Mark all as read mutation
        markAllNotificationsAsRead,

        // Drawer
        notificationDrawerOpen,
        setNotificationDrawerOpen,

        // Search (merged filter + pagination)
        searchState,
        setSearchState,
        resetSearchState,
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};
