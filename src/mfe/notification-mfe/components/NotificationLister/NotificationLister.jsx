import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { CustomCard, Button, Loader } from '@mckesson/mcp-component-library';

// Styles
import './NotificationLister.scss';

// Internal imports
import { useNotifications } from '../../context/NotificationsContext';
import EmptyNotificationView from '../EmptyNotificationsView/EmptyNotificationsView';

const NotificationLister = ({ isDrawerView = false, closeDrawer, isMobileView, setIsDetailView }) => {
  // Hooks
  const { t } = useTranslate();
  const navigate = useNavigate();
  const contentRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Context
  const {
    paginatedNotifications: notifications,
    markAllNotificationsAsRead,
    selectedNotification,
    setSelectedNotification,
    markNotificationAsReadById,
    loadMoreNotifications
  } = useNotifications();

  // Constants
  const elementSize = isMobileView ? 'sm' : 'md';
  const drawerPageSize = 8;
  const displayedNotifications = isDrawerView ? notifications.slice(0, drawerPageSize) : notifications;

  // Date formatting
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });

  // Helpers
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

  // Handlers
  const handleClick = (notification) => {
    setSelectedNotification(notification);
    markNotificationAsReadById(notification.id);
    if (isDrawerView) {
      if (typeof closeDrawer === 'function') closeDrawer();
      navigate('/notifications');
    }
    if (isMobileView && setIsDetailView) {
      setIsDetailView(true);
    }
  };

  const handleKeyDown = (notification) => (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(notification);
    }
  };

  // Infinite scroll effect
  useEffect(() => {
    if (isDrawerView) return;
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && !isLoading) {
        setIsLoading(true);
        Promise.resolve(loadMoreNotifications()).finally(() => setIsLoading(false));
      }
    };
    const el = contentRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => {
      if (el) el.removeEventListener('scroll', handleScroll);
    };
  }, [isDrawerView, loadMoreNotifications, isLoading]);

  // Render
  return (
    <div className="notification-lister-container">
      <div className="notification-lister-header">
        <div className="date-display">{formattedDate}</div>
        <div className="all-read-cta">
          <Button id="mark-all-btn" variant="tertiary" size={elementSize} onClick={markAllNotificationsAsRead}>
            {t('notifications.cta.markAll')}
          </Button>
        </div>
      </div>
      <div ref={contentRef} className={`notification-lister-content${!isDrawerView ? ' notification-lister-content--fixed-width' : ''}`}>
        {displayedNotifications.length < 1 ? (
          <EmptyNotificationView
            isDrawerView={isDrawerView}
            text={t('notifications.empty')}
            subtext={t(!isDrawerView ? 'notifications.emptySubtextFiltered' : 'notifications.emptySubtext')}
          />
        ) : (
          <>
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
            {isLoading && (
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
