// External dependencies
import React from 'react';

// Styles
import styles from './NotificationViewer.module.scss';

// Context and hooks
import { useNotifications } from '../../context/NotificationsContext';
import { useTranslate } from '@src/translations/useTranslation';

// Utilities
import { getTimeAgo } from '@src/util/DateUtil';

const NotificationViewer = () => {
  const { t } = useTranslate();
  const { selectedNotification } = useNotifications();

  if (!selectedNotification) {
    return (
      <div className={`${styles.notificationViewer} ${styles.notificationViewerEmpty}`}>
        <span className={styles.notificationViewerEmptyText}></span>
      </div>
    );
  }

  const formattedDate = new Date(selectedNotification?.createdDate).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Remove \n and \\n from messageContent if present
  const cleanedMessageContent = selectedNotification.messageContent ? selectedNotification.messageContent.replace(/\\n|\n/g, '') : '';

  return (
    <div className={styles.notificationViewer}>
      <div className={styles.notificationViewerHeaderRow}>
        <span className={styles.notificationViewerSection}>
          {t('notification.category', 'Category')}: {selectedNotification?.category}
        </span>
        <span className={styles.notificationViewerDate}>
          {getTimeAgo(formattedDate)} • {formattedDate}
        </span>
      </div>
      <div className={styles.notificationViewerTitleRow}>
        <span className={styles.notificationViewerTitle}>{selectedNotification.messageTitle}</span>
      </div>
      <div className={styles.notificationViewerDesc}>{selectedNotification.messageDescription}</div>
      <div className={styles.notificationContent}>
        {selectedNotification.messageContent && <div className={styles.notificationHtmlContent} dangerouslySetInnerHTML={{ __html: cleanedMessageContent }} />}
      </div>
    </div>
  );
};

export default NotificationViewer;
