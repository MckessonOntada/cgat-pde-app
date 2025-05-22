import React, { useCallback } from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import FloatingDrawer from '@src/components/floating-drawer';
import styles from './NotificationDrawer.module.scss';
import NotificationLister from '../NotificationLister/NotificationLister';
import { Button } from '@mckesson/mcp-component-library';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationsContext';

export const NotificationDrawer = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();

  const { notificationsCount, notificationDrawerOpen, setNotificationDrawerOpen } = useNotifications();

  const handleClose = useCallback(() => {
    setNotificationDrawerOpen(false);
  }, []);

  const onSeeAllNotifications = useCallback(() => {
    setNotificationDrawerOpen(false);
    // Add logic to navigate to the notifications page
    navigate('/notifications');
  }, []);

  return (
    <div className={styles.notificationDrawer}>
      <FloatingDrawer
        open={notificationDrawerOpen}
        onClose={handleClose}
        anchor="right"
        heading={`${t('notifications.title')} (${notificationsCount})`}
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
        }>
        <div className={styles.notificationDrawerContent}>
          <NotificationLister isDrawerView={true} closeDrawer={handleClose} />
        </div>
      </FloatingDrawer>
    </div>
  );
};
