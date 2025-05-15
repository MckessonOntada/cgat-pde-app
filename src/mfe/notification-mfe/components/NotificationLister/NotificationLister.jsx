import React from 'react';
import { CustomCard, Button } from '@mckesson/mcp-component-library';
import './NotificationLister.scss';
import { useIntl } from 'react-intl';

const NotificationLister = ({
  notifications,
  selectedNotification,
  setSelectedNotification
}) => {
  const intl = useIntl();

  // Get today's date and format as "Month DD, YYYY"
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });

  return (
    <div className="notification-lister-container">
      <div className="notification-lister-header">
        <div className="date-display">{formattedDate}</div>
        <div className="all-read-cta">
          <Button
            id="mark-all-btn"
            variant="tertiary"
            size="md"
            onClick={() => {}}>
            {intl.formatMessage({ id: 'notifications.cta.markAll' })}
          </Button>
        </div>
      </div>
      <div className="notification-lister-content">
        {notifications.map((notification) => {
          const isActive =
            selectedNotification && selectedNotification.id === notification.id;
          return (
            <div
              key={notification.id}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
              className="notification-list-card-wrapper"
              onClick={() => setSelectedNotification(notification)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedNotification(notification);
                }
              }}>
              <CustomCard
                className={`notification-list-card${
                  isActive ? ' active' : ''
                }`}>
                <div className={`notification-title-row`}>
                  <div
                    className={`notification-title`}>
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
