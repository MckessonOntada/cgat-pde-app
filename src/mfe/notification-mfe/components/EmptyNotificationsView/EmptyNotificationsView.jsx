// -----------------------------------------------------------------------------
// Imports
// -----------------------------------------------------------------------------
import React from 'react';
// SVG icon for empty notifications
import { ReactComponent as NoNotificationsIcon } from '../../assets/svg/noNotifications.svg';
// Styles for the component
import styles from './EmptyNotificationsView.module.scss';

// -----------------------------------------------------------------------------
// EmptyNotificationView Component
// -----------------------------------------------------------------------------
// Displays a message and icon when there are no notifications.
// Props:
//   - isDrawerView: Boolean to determine drawer or full view styling
//   - text: Main message to display
//   - subtext: Secondary message to display
// -----------------------------------------------------------------------------
const EmptyNotificationView = ({ isDrawerView, text, subtext }) => (
  <div
    className={
      isDrawerView
        ? styles.noNotificationsDrawerWrapper
        : styles.noNotificationsWrapper
    }
  >
    {/* Icon representing no notifications */}
    <NoNotificationsIcon />
    <div className={styles.noNotifications}>
      {/* Main notification text */}
      <div className={styles.noNotificationsText}>{text}</div>
      {/* Subtext for additional context */}
      <div className={styles.noNotificationsSubtext}>{subtext}</div>
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// Export
// -----------------------------------------------------------------------------
export default EmptyNotificationView;
