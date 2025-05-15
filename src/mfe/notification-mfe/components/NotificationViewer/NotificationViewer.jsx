import React from 'react';
import styles from './NotificationViewer.module.scss';

const NotificationViewer = ({ notification }) => {
  if (!notification) {
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
          {notification.details?.section}
        </span>
        <span className={styles.notificationViewerDate}>
          {notification.details?.timeAgo} {notification.date}
        </span>
      </div>
      <div className={styles.notificationViewerTitleRow}>
        <span className={styles.notificationViewerTitle}>
          {notification.title}
        </span>
      </div>
      <div className={styles.notificationViewerDesc}>
        {notification.description}
      </div>
    </div>
  );
};

export default NotificationViewer;
