import React from 'react';
import styles from './NotificationViewer.module.scss';
import { useNotifications } from '../../context/NotificationsContext';

const NotificationViewer = () => {
  const { selectedNotification } = useNotifications();

  if (!selectedNotification) {
    return (
      <div
        className={`${styles.notificationViewer} ${styles.notificationViewerEmpty}`}>
        <span className={styles.notificationViewerEmptyText}>
          Select a notification to view details.
        </span>
      </div>
    );
  }

  return (
    <div className={styles.notificationViewer}>
      <div className={styles.notificationViewerHeaderRow}>
        <span className={styles.notificationViewerSection}>
          {selectedNotification.details?.section}
        </span>
        <span className={styles.notificationViewerDate}>
          {selectedNotification.details?.timeAgo} {selectedNotification.date}
        </span>
      </div>
      <div className={styles.notificationViewerTitleRow}>
        <span className={styles.notificationViewerTitle}>
          {selectedNotification.title}
        </span>
      </div>
      <div className={styles.notificationViewerDesc}>
        {selectedNotification.description}
      </div>
      <div className={styles.notificationContent}>
        {selectedNotification.content && (
          <div
            className={styles.notificationHtmlContent}
            dangerouslySetInnerHTML={{ __html: selectedNotification.content }}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationViewer;
