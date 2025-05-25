import React, { createContext, useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useMutation } from 'react-query';

import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import { serializeParams } from '@src/util/ApiUtils';
import useSnackbar from '@src/hooks/useSnackbar';
import { useTranslate } from '@src/translations/useTranslation';

// Context and custom hook
const NotificationsContext = createContext();
export const useNotifications = () => useContext(NotificationsContext);

// Initial state
const initialFilterState = {
  notificationDateRange: [dayjs().subtract(90, 'day').format('MM/DD/YYYY'), dayjs().format('MM/DD/YYYY')],
  notificationCategory: ''
};

const initialPaginationState = {
  page: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 0
};

export const NotificationsProvider = ({ children }) => {
  // State hooks

  // Notifications State Group
  const [paginatedNotifications, setPaginatedNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingMoreNotifications, setLoadingMoreNotifications] = useState(false); // NEW STATE

  // Unread Count State
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerUnreadCount, setDrawerUnreadCount] = useState(0);
  const [paginatedUnreadCount, setPaginatedUnreadCount] = useState(0);

  // Drawer State
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Filter State
  const [filterState, setFilterState] = useState(initialFilterState);

  // Pagination State
  const [paginationState, setPaginationState] = useState(initialPaginationState);

  // Dropdown State
  const [dropdownOptions, setDropdownOptions] = useState([]);

  // Hooks
  const { showSnackbar } = useSnackbar();
  const { t } = useTranslate();

  // Mutations
  const unreadCountMutation = useMutation(
    async () => {
      const payload = {
        searchText: '',
        category: '',
        startDate: '',
        endDate: dayjs().format('YYYY-MM-DD')
      };
      const response = await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS_UNREAD_COUNT(), httpVerb.POST, payload);
      return response;
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

  const notificationsMutation = useMutation(
    async () => {
      // Set loading states
      if (paginationState.page === initialPaginationState.page) {
        setLoadingNotifications(true);
      } else {
        setLoadingMoreNotifications(true); // Set loading more when loading next pages
      }
      const endDateFromFilter = dayjs(filterState.notificationDateRange[1], 'MM/DD/YYYY');
      const now = dayjs();
      const effectiveEndDate = endDateFromFilter.isAfter(now) ? endDateFromFilter : now;

      const payload = {
        searchText: '',
        category: filterState.notificationCategory,
        startDate: dayjs(filterState.notificationDateRange[0], 'MM/DD/YYYY').format('YYYY-MM-DD'),
        endDate: effectiveEndDate.format('YYYY-MM-DD')
      };
      const paramsObj = {
        pageNo: paginationState.page - 1,
        pageSize: paginationState.pageSize
      };
      const response = await HttpResourceService.callRest(`${ApiRoutes.NOTIFICATIONS()}?${serializeParams(paramsObj)}`, httpVerb.POST, payload);
      console.log('response', response);
      return response;
    },
    {
      onSuccess: (response) => {
        if (paginationState.page === initialPaginationState.page) {
          setLoadingNotifications(false);
        } else {
          setLoadingMoreNotifications(false); // Reset loading more
        }
        if (response.status === 200) {
          const notifications = response.data.response;
          if (notifications.length > 0) {
            setPaginatedNotifications((prev) => (paginationState.page > 1 ? [...prev, ...notifications] : notifications));
          } else {
            setPaginatedNotifications([]);
          }
          setPaginationState((prevState) => ({
            ...prevState,
            totalElements: response.data.totalRecords,
            totalPages: response.data.totalPageCount
          }));
        }
      },
      onError: () => {
        if (paginationState.page === initialPaginationState.page) {
          setLoadingNotifications(false);
        } else {
          setLoadingMoreNotifications(false); // Reset loading more
        }
        setPaginatedNotifications([]);
      }
    }
  );

  // Call PATCH API to mark all notifications as read using react-query
  const markAllNotificationsAsReadMutation = useMutation(
    async () => {
      const response = await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS_MARK_ALL_READ(), httpVerb.PATCH);
      return response;
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

  // Call PATCH API to mark notification as read by ID using react-query
  const markNotificationAsReadMutation = useMutation(
    async (notificationId) => {
      const response = await HttpResourceService.callRest(ApiRoutes.NOTIFICATIONS_MARK_READ_BY_ID(notificationId), httpVerb.PATCH);
      return response;
    },
    {
      onSuccess: (response) => {
        if (response.status === 200) {
          showSnackbar({
            description: t('notifications.markReadSuccess'),
            type: 'success'
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

  // Effects

  // On set of selected notification
  useEffect(() => {
    if (selectedNotification && selectedNotification.id) {
      // Mark notification as read when selected
      if (!selectedNotification.readStatus) {
        markNotificationAsReadById(selectedNotification.id);
      }
    }
  }, [selectedNotification]);

  // Unread count: fetch on mount and every 5 minutes
  useEffect(() => {
    unreadCountMutation.mutate();
    const interval = setInterval(() => {
      unreadCountMutation.mutate();
    }, 5 * 60 * 1000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  // Reset pagination when filter changes
  useEffect(() => {
    setPaginationState(initialPaginationState);
  }, [filterState]);

  // Fetch notifications on mount/filter change, poll every 5 min if filter is initial
  useEffect(() => {
    notificationsMutation.mutate();
    let interval;
    if (JSON.stringify(filterState) === JSON.stringify(initialFilterState)) {
      interval = setInterval(() => {
        notificationsMutation.mutate();
      }, 5 * 60 * 1000); // 5 minutes
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // Update unread count and dropdown options when notifications change
  useEffect(() => {
    if (paginatedNotifications.length > 0) {
      setPaginatedUnreadCount(paginatedNotifications.filter((notification) => !notification.readStatus).length);
      setDrawerUnreadCount(paginatedNotifications.slice(0,8).filter((notification) => !notification.readStatus).length);
      setDropdownOptions(buildDropdownOptions(paginatedNotifications));
    } else {
      setSelectedNotification(null);
    }
  }, [paginatedNotifications]);

  // Fetch more notifications when page increases
  useEffect(() => {
    if (paginationState.page > 1) {
      notificationsMutation.mutate();
    }
  }, [paginationState.page]);

  // Helpers
  const buildDropdownOptions = (notifications) => {
    const categoryOptions = Array.from(new Set(notifications.map((n) => n.category))).map((category) => ({
      label: category,
      value: category
    }));
    return [{ label: 'All', value: '' }, ...categoryOptions];
  };

  const markAllNotificationsAsRead = () => {
    console.log('Marking all notifications as read');
    // markAllNotificationsAsReadMutation.mutate();
  };

  const markNotificationAsReadById = (notificationId) => {
    console.log('Marking notification as read:', notificationId);
    // markNotificationAsReadMutation.mutate(notificationId);
  };

  const loadMoreNotifications = () => {
    if (paginationState.page < paginationState.totalPages) {
      setPaginationState((prevState) => ({
        ...prevState,
        page: prevState.page + 1
      }));
    }
  };

  // Reset functions
  const resetPaginationState = () => {
    setPaginationState(initialPaginationState);
  };

  const resetFilterState = () => {
    setFilterState(initialFilterState);
  };

  const resetDropdownOptions = () => {
    setDropdownOptions([]);
  };

  // Provider
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
        loadingMoreNotifications, // PROVIDE TO CONTEXT

        // Mark all as read mutation
        markAllNotificationsAsRead,

        // Drawer
        notificationDrawerOpen,
        setNotificationDrawerOpen,

        // Filter
        filterState,
        setFilterState,

        // Dropdown
        dropdownOptions
      }}>
      {children}
    </NotificationsContext.Provider>
  );
};
