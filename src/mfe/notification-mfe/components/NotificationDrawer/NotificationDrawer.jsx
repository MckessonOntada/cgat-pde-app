// External dependencies
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// UI components
import { Button } from '@mckesson/mcp-component-library';
import FloatingDrawer from '@src/components/floating-drawer';
import NotificationLister from '../NotificationLister/NotificationLister';

// Hooks and context
import { useTranslate } from '@src/translations/useTranslation';
import { useNotifications } from '../../context/NotificationsContext';

// Styles
import styles from './NotificationDrawer.module.scss';

export const NotificationDrawer = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { drawerUnreadCount, notificationDrawerOpen, setNotificationDrawerOpen } = useNotifications();

  const handleClose = useCallback(() => {
    setNotificationDrawerOpen(false);
  }, [setNotificationDrawerOpen]);

  const onSeeAllNotifications = useCallback(() => {
    setNotificationDrawerOpen(false);
    navigate('/notifications');
  }, [setNotificationDrawerOpen, navigate]);

  return (
    <div className={styles.notificationDrawer}>
      <FloatingDrawer
        open={notificationDrawerOpen}
        onClose={handleClose}
        anchor="right"
        heading={`${t('notifications.title')} (${drawerUnreadCount})`}
        controls={
          <div className={styles.controls}>
            <Button
              label={t('notifications.cta.seeAllNotifications')}
              onClick={onSeeAllNotifications}
              variant="secondary"
              size="md"
              buttonWidth={'100%'}
              aria-label={t('notifications.cta.seeAllNotifications')}
            />
          </div>
        }
      >
        <div className={styles.notificationDrawerContent}>
          <NotificationLister isDrawerView={true} closeDrawer={handleClose} />
        </div>
      </FloatingDrawer>
    </div>
  );
};
