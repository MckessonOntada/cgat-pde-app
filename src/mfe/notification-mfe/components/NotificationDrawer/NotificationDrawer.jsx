// ==========================
// NotificationDrawer Component
// ==========================

// ----------- External dependencies -----------
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ----------- UI Components -----------
import { Button } from '@mckesson/mcp-component-library';
import FloatingDrawer from '@src/components/floating-drawer';
import NotificationLister from '../NotificationLister/NotificationLister';

// ----------- Hooks and Context -----------
import { useTranslate } from '@src/translations/useTranslation';
import { useNotifications } from '../../context/NotificationsContext';

// ----------- Styles -----------
import styles from './NotificationDrawer.module.scss';

/**
 * NotificationDrawer
 *
 * Displays a floating drawer containing a list of notifications.
 * Allows users to view all notifications and close the drawer.
 */
export const NotificationDrawer = () => {
  // Translation hook for i18n
  const { t } = useTranslate();

  // React Router navigation
  const navigate = useNavigate();

  // Notification context: unread count, drawer state, and setter
  const { unreadCount, notificationDrawerOpen, setNotificationDrawerOpen, fetchNotifications, isNotificationsPage  } = useNotifications();

  /**
   * Closes the notification drawer.
   */
  const handleClose = useCallback(() => {
    setNotificationDrawerOpen(false);
  }, [setNotificationDrawerOpen]);

  /**
   * Navigates to the notifications page and closes the drawer.
   */
  const onSeeAllNotifications = useCallback(() => {
    setNotificationDrawerOpen(false);
    !isNotificationsPage && navigate('/notifications');
  }, [setNotificationDrawerOpen, navigate]);

  // Only show the count if it's greater than 0
  const heading = unreadCount > 0 ? `${t('notifications.title')} (${unreadCount})` : t('notifications.title');

  return (
    <div className={styles.notificationDrawer}>
      <FloatingDrawer
        open={notificationDrawerOpen}
        onClose={handleClose}
        anchor="right"
        heading={heading}
        controls={
          <div className={styles.controls}>
            {/* Button to view all notifications */}
            <Button
              label={t('notifications.cta.seeAllNotifications')}
              onClick={onSeeAllNotifications}
              variant="secondary"
              size="md"
              buttonWidth={'100%'}
              aria-label={t('notifications.cta.seeAllNotifications')}
            />
          </div>
        }>
        <div className={styles.notificationDrawerContent}>
          {/* List of notifications in drawer view */}
          <NotificationLister isDrawerView={true} closeDrawer={handleClose} />
        </div>
      </FloatingDrawer>
    </div>
  );
};
