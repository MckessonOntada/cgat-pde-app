import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate } from 'react-router-dom';
import { CustomCard, Button } from '@mckesson/mcp-component-library';
import './NotificationLister.scss';
import { useNotifications } from '../../context/NotificationsContext';

const NotificationLister = ({ isDrawerView = false, closeDrawer }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const {
    notifications,
    markAllNotificationsAsRead,
    selectedNotification,
    setSelectedNotification,
    markNotificationAsReadById
  } = useNotifications();

  // Get today's date and format as "Month DD, YYYY"
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });

  const handleClick = (notification) => {
    setSelectedNotification(notification);
    // markNotificationAsReadById(notification.id);
    if (isDrawerView) {
      if (typeof closeDrawer === 'function') closeDrawer();
      navigate('/notifications');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  // Determine notifications to display based on isDrawerView
  const displayedNotifications = isDrawerView
    ? notifications.slice(0, 8)
    : notifications;

  return (
    <div className="notification-lister-container">
      <div className="notification-lister-header">
        <div className="date-display">{formattedDate}</div>
        <div className="all-read-cta">
          <Button
            id="mark-all-btn"
            variant="tertiary"
            size="md"
            onClick={markAllNotificationsAsRead}>
            {t('notifications.cta.markAll')}
          </Button>
        </div>
      </div>
      <div className="notification-lister-content">
        {displayedNotifications.map((notification) => {
          const isActive =
            selectedNotification && selectedNotification.id === notification.id;
          return (
            <div
              key={notification.id}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              className="notification-list-card-wrapper"
              onClick={() => handleClick(notification)}
              onKeyDown={handleKeyDown}>
              <CustomCard
                className={`notification-list-card${
                  !isDrawerView && isActive ? ' active' : ''
                }`}>
                <div className={`notification-title-row`}>
                  <div className={`notification-title`}>
                    {notification.title}
                  </div>
                  {notification.unread && (
                    <span className="notification-unread-dot" />
                  )}
                </div>
                <div className="notification-description">
                  {notification.description}
                </div>
                <div className="notification-date">{notification.date}</div>
              </CustomCard>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NotificationLister;
