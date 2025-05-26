// ==============================
// External dependencies
// ==============================
import React from 'react';

// ==============================
// Styles
// ==============================
import styles from './NotificationViewer.module.scss';

// ==============================
// Context and hooks
// ==============================
import { useNotifications } from '../../context/NotificationsContext';
import { useTranslate } from '@src/translations/useTranslation';

// ==============================
// Utilities
// ==============================
import { getTimeAgo } from '@src/util/DateUtil';

/**
 * NotificationViewer Component
 * ---------------------------
 * Displays the details of the currently selected notification.
 * If no notification is selected, shows an empty state.
 */
const NotificationViewer = () => {
  // Translation hook
  const { t } = useTranslate();

  // Get the currently selected notification from context
  const { selectedNotification } = useNotifications();

  // If no notification is selected, render the empty state
  if (!selectedNotification) {
    return (
      <div className={`${styles.notificationViewer} ${styles.notificationViewerEmpty}`}>
        <span className={styles.notificationViewerEmptyText}></span>
      </div>
    );
  }

  // Format the notification's creation date for display
  const formattedDate = new Date(selectedNotification?.createdDate).toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Clean up message content by removing newline characters
  const cleanedMessageContent = selectedNotification.messageContent ? selectedNotification.messageContent.replace(/\\n|\n/g, '') : '';

  return (
    <div className={styles.notificationViewer}>
      {/* Header row: category and date */}
      <div className={styles.notificationViewerHeaderRow}>
        <span className={styles.notificationViewerSection}>
          {t('notification.category', 'Category')}: {selectedNotification?.category}
        </span>
        <span className={styles.notificationViewerDate}>
          {getTimeAgo(formattedDate)} • {formattedDate}
        </span>
      </div>

      {/* Title row */}
      <div className={styles.notificationViewerTitleRow}>
        <span className={styles.notificationViewerTitle}>{selectedNotification.messageTitle}</span>
      </div>

      {/* Description */}
      <div className={styles.notificationViewerDesc}>{selectedNotification.messageDescription}</div>

      {/* Main content (HTML) */}
      <div className={styles.notificationContent}>
        {selectedNotification.messageContent && (
          <div
            className={styles.notificationHtmlContent}
            // Render HTML content safely
            dangerouslySetInnerHTML={{ __html: cleanedMessageContent }}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationViewer;
