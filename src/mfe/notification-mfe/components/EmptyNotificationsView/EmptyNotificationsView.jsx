// Imports
import React from 'react';
import { ReactComponent as NoNotificationsIcon } from '../../assets/svg/noNotifications.svg';
import styles from './EmptyNotificationsView.module.scss';

// Component
const EmptyNotificationView = ({ isDrawerView, text, subtext }) => (
    <div
        className={
            isDrawerView
                ? styles.noNotificationsDrawerWrapper
                : styles.noNotificationsWrapper
        }
    >
        <NoNotificationsIcon />
        <div className={styles.noNotifications}>
            <div className={styles.noNotificationsText}>{text}</div>
            <div className={styles.noNotificationsSubtext}>{subtext}</div>
        </div>
    </div>
);

// Export
export default EmptyNotificationView;
