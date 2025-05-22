import React from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import { useNavigate } from 'react-router-dom';
import { CustomCard, Button } from '@mckesson/mcp-component-library';
import './NotificationLister.scss';
import { useNotifications } from '../../context/NotificationsContext';
import { ReactComponent as NoNotificationsIcon } from '../../assets/svg/noNotifications.svg';

const NotificationLister = ({ isDrawerView = false, closeDrawer, isMobileView, setIsDetailView }) => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const elementSize = isMobileView ? 'sm' : 'md';

  const { notifications, markAllNotificationsAsRead, selectedNotification, setSelectedNotification, markNotificationAsReadById } = useNotifications();

  // Get today's date and format as "Month DD, YYYY"
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });

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

  // Determine notifications to display based on isDrawerView and page size from env
  const pageSize = parseInt(process.env.REACT_APP_NOTIFICATION_PAGE_SIZE, 10) || 10;
  const displayedNotifications = isDrawerView ? notifications.slice(0, pageSize) : notifications;

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
      <div className={`notification-lister-content${!isDrawerView ? ' notification-lister-content--fixed-width' : ''}`}>
        {displayedNotifications.length < 1 ? (
          <div className="no-notifications-wrapper">
            <NoNotificationsIcon />
            <div className="no-notifications">
              <div className="no-notifications-text">{t('notifications.empty')}</div>
              <div className="no-notifications-subtext">{t('notifications.emptySubtext')}</div>
            </div>
          </div>
        ) : (
          displayedNotifications.map((notification) => {
            const isActive = !isMobileView && selectedNotification && selectedNotification.id === notification.id;
            return (
              <div
                key={notification.id}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                className="notification-list-card-wrapper"
                onClick={() => handleClick(notification)}
                onKeyDown={handleKeyDown(notification)}>
                <CustomCard className={`notification-list-card${!isDrawerView && isActive ? ' active' : ''}`}>
                  <div className={`notification-title-row`}>
                    <div className={`notification-title`}>{notification.title}</div>
                    {notification.unread && <span className="notification-unread-dot" />}
                  </div>
                  <div className="notification-description">{notification.description}</div>
                  <div className="notification-date">{notification.date}</div>
                </CustomCard>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationLister;
