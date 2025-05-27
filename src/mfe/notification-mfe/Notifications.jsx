// ==========================
// External Libraries
// ==========================
import React, { useEffect, useState } from 'react';

// ==========================
// Hooks
// ==========================
import useWindowSize from '@src/hooks/UseWindowSize';
import { useTranslate } from '@src/translations/useTranslation';

// ==========================
// Context
// ==========================
import { useNotifications } from './context/NotificationsContext';

// ==========================
// Components
// ==========================
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import NotificationLister from './components/NotificationLister/NotificationLister';
import NotificationViewer from './components/NotificationViewer/NotificationViewer';
import FilterToolbar from './components/FilterToolbar/FilterToolbar';

// ==========================
// Assets
// ==========================
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';

// ==========================
// Styles
// ==========================
import './Notifications.scss';

// ==========================
// Constants
// ==========================
const TABLET_BREAKPOINT = 768;

/**
 * Notifications Component
 *
 * Handles the display of notifications, including list and detail views,
 * responsive layout for mobile and desktop, and navigation controls.
 *
 * Features:
 * - Responsive design: switches between side-by-side and stacked layouts based on screen width.
 * - Displays a list of notifications and a detail viewer.
 * - Provides a back navigation button with context-aware behavior.
 * - Shows an informational alert and a filter toolbar.
 * - Resets selected notification on unmount.
 *
 * @component
 * @returns {JSX.Element} The rendered Notifications component.
 */

const Notifications = () => {
  // ==========================
  // Hooks & Context
  // ==========================
  const windowSize = useWindowSize();
  const { t } = useTranslate();
  const { isNotificationsPage, fetchNotifications, filteredUnreadCount, setSelectedNotification, resetSearchState } = useNotifications();

  // ==========================
  // State
  // ==========================
  const isMobileView = windowSize.width < TABLET_BREAKPOINT;
  const elementSize = isMobileView ? 'sm' : 'md';
  const [isDetailView, setIsDetailView] = useState(false);

  // ==========================
  // Effects
  // ==========================
  // Reset selected notification on component unmount
  useEffect(() => {
    isNotificationsPage && fetchNotifications();
  }, [isNotificationsPage]);

  // ==========================
  // Handlers
  // ==========================
  /**
   * Handles back navigation.
   * - On desktop: navigates back in history.
   * - On mobile: toggles between detail and list view or navigates back.
   */
  const onBackTo = () => {
    resetSearchState();
    setSelectedNotification(null);
    if (!isMobileView) {
      window.history.back();
    } else {
      isDetailView ? setIsDetailView(false) : window.history.back();
    }
  };

  // ==========================
  // Render
  // ==========================
  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <div className="notifications-container">
          {/* Top Navigation Bar */}
          <div className="top-nav">
            <Button className="back-button-control" variant="tertiary" Icon={IconArrowLeft} onClick={onBackTo} size={elementSize}>
              {isMobileView ? t('notifications.cta.backMobile') : t('notifications.cta.back')}
            </Button>
          </div>
          {/* Header with Title and Filter */}
          {!isDetailView && (
            <div className="notifications-header">
              <div className="heading">
                <Heading as="h1" size={'var(--brand-font-size--28, 28px)'}>
                  {t('notifications.title')}
                  {filteredUnreadCount > 0 && <span className="count"> ({filteredUnreadCount})</span>}
                </Heading>
              </div>
              <FilterToolbar isMobileView={isMobileView} />
            </div>
          )}
          {/* Info Alert */}
          {!isDetailView && (
            <div className="notifications-info">
              <Alert description={t('notifications.info.cleared')} showCloseIcon={false} title="" size="sm" />
            </div>
          )}
          {/* Main Content: Responsive Layout */}
          {!isMobileView ? (
            // Desktop/Tablet: List and Detail side by side
            <div className="notifications-content">
              <div className="notifications-list">
                <NotificationLister isMobileView={isMobileView} />
              </div>
              <div className="notification-detail">
                <NotificationViewer isMobileView={isMobileView} />
              </div>
            </div>
          ) : !isDetailView ? (
            // Mobile: Show list, pass setIsDetailView to allow switching to detail
            <div className="notifications-list">
              <NotificationLister isMobileView={isMobileView} setIsDetailView={setIsDetailView} />
            </div>
          ) : (
            // Mobile: Show detail view
            <div className="notification-detail">
              <NotificationViewer isMobileView={isMobileView} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
