import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { CustomCard, Button, Loader } from '@mckesson/mcp-component-library';

// Styles
import './NotificationLister.scss';

// Internal imports
import { useNotifications } from '../../context/NotificationsContext';
import EmptyNotificationView from '../EmptyNotificationsView/EmptyNotificationsView';

/**
 * NotificationLister component displays a list of notifications with support for infinite scrolling,
 * marking all as read, and responsive behavior for drawer and mobile views.
 *
 * @component
 * @param {Object} props - Component props
 * @param {boolean} [props.isDrawerView=false] - If true, renders in drawer mode with limited notifications.
 * @param {function} [props.closeDrawer] - Function to close the drawer (used in drawer view).
 * @param {boolean} props.isMobileView - If true, renders in mobile view with adjusted UI.
 * @param {function} [props.setIsDetailView] - Function to toggle detail view in mobile mode.
 *
 * @returns {JSX.Element} The rendered NotificationLister component.
 */
const NotificationLister = ({ isDrawerView = false, closeDrawer }) => {
  // =========================
  // Hooks & Context
  // =========================
  const { t } = useTranslate();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  // Notification context values
  const {
    drawerNotifications,
    notifications,
    markAllNotificationsAsRead,
    selectedNotification,
    setSelectedNotification,
    loadMoreNotifications,
    loadingDrawerNotifications,
    loadingNotifications,
    loadingMoreNotifications,
    filteredUnreadCount,
    unreadCount,
    isMobileView, setIsDetailView
  } = useNotifications();

  // =========================
  // Constants & Derived Data
  // =========================

  // Button size based on view
  const elementSize = isMobileView ? 'sm' : 'md';

  // Limit notifications in drawer view
  const displayedNotifications = isDrawerView ? drawerNotifications : notifications;

  // Today's formatted date for header
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });

  // =========================
  // Helpers
  // =========================

  /**
   * Format notification created date for display
   * @param {string} dateString
   * @returns {string}
   */
  const formatCreatedDate = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    return dateObj.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // =========================
  // Event Handlers
  // =========================

  /**
   * Handle notification card click
   * @param {object} notification
   */
  const handleClick = (notification) => {
    setSelectedNotification(notification);
    if (isDrawerView) {
      if (typeof closeDrawer === 'function') closeDrawer();
      navigate('/notifications');
    }
    if (isMobileView && setIsDetailView) {
      setIsDetailView(true);
    }
  };

  /**
   * Handle keyboard interaction for notification card
   * @param {object} notification
   * @returns {function}
   */
  const handleKeyDown = (notification) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(notification);
    }
  };

  // =========================
  // Effects
  // =========================

  // Infinite scroll: load more notifications when scrolled to bottom
  useEffect(() => {
    if (isDrawerView) return;

    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      // If scrolled near bottom and not already loading more, fetch more notifications
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && !loadingMoreNotifications) {
        loadMoreNotifications();
      }
    };

    const el = contentRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [isDrawerView, loadMoreNotifications, loadingMoreNotifications]);

  // =========================
  // Render
  // =========================

  // Show loader if drawer notifications are loading and in drawer view
  if (loadingDrawerNotifications && isDrawerView) {
    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          width: '412px',
          height: '912px',
          justifyContent: 'center'
        }}
      >
        <Loader variant="circular" />
      </div>
    );
  }

  // Show loader if notifications are loading and not in drawer view
  if (loadingNotifications && !isDrawerView) {
    return (
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          width: '412px',
          height: '912px',
          justifyContent: 'center'
        }}
      >
        <Loader variant="circular" />
      </div>
    );
  }

  const getDisabilityStatus = () => {
    if (isDrawerView) {
      return loadingDrawerNotifications || unreadCount === 0;
    } else {
      return loadingNotifications || loadingMoreNotifications || filteredUnreadCount === 0;
    }
  };

  // Main notification list UI
  return (
    <div className="notification-lister-container">
      {/* Header with date and mark all as read button */}
      <div className="notification-lister-header">
        <div className="date-display">{formattedDate}</div>
        <div className="all-read-cta">
          <Button id="mark-all-btn" variant="tertiary" size={elementSize} onClick={markAllNotificationsAsRead} disabled={getDisabilityStatus()}>
            {t('notifications.cta.markAll')}
          </Button>
        </div>
      </div>

      {/* Notification list or empty state */}
      <div ref={contentRef} className={`notification-lister-content${!isDrawerView ? ' notification-lister-content--fixed-width' : ''}`}>
        {displayedNotifications.length < 1 ? (
          <EmptyNotificationView
            isDrawerView={isDrawerView}
            text={t('notifications.empty')}
            subtext={t(!isDrawerView ? 'notifications.emptySubtextFiltered' : 'notifications.emptySubtext')}
          />
        ) : (
          <>
            {/* Notification cards */}
            {displayedNotifications.map((notification) => {
              const isActive = !isMobileView && selectedNotification && selectedNotification.id === notification.id;

              return (
                <div
                  key={notification.id}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  className="notification-list-card-wrapper"
                  onClick={() => handleClick(notification)}
                  onKeyDown={handleKeyDown(notification)}
                >
                  <CustomCard className={`notification-list-card${!isDrawerView && isActive ? ' active' : ''}`}>
                    <div className="notification-title-row">
                      <div className="notification-title">{notification.messageTitle}</div>
                      {!notification.readStatus && <span className="notification-unread-dot" />}
                    </div>
                    <div className="notification-description">{notification.messageDescription}</div>
                    <div className="notification-date">{formatCreatedDate(notification.createdDate)}</div>
                  </CustomCard>
                </div>
              );
            })}

            {/* Loader for loading more notifications */}
            {loadingMoreNotifications && (
              <div
                style={{
                  alignItems: 'center',
                  border: '1px solid #bac5cc',
                  display: 'flex',
                  height: '90px',
                  justifyContent: 'center',
                  borderRadius: '8px',
                  backgroundColor: '#fff'
                }}
              >
                <Loader variant="circular" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationLister;
