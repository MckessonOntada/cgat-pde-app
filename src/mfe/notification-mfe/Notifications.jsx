// External libraries
import React, { useEffect, useState } from 'react';

// Hooks
import useWindowSize from '@src/hooks/UseWindowSize';
import { useTranslate } from '@src/translations/useTranslation';

// Context
import { useNotifications } from './context/NotificationsContext';

// Components
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import NotificationLister from './components/NotificationLister/NotificationLister';
import NotificationViewer from './components/NotificationViewer/NotificationViewer';
import FilterToolbar from './components/FilterToolbar/FilterToolbar';

// Assets
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';

// Styles
import './Notifications.scss';

const TABLET_BREAKPOINT = 768;

const Notifications = () => {
  // Hooks
  const windowSize = useWindowSize();
  const { t } = useTranslate();
  const { paginatedUnreadCount, setSelectedNotification } = useNotifications();

  // State
  const isMobileView = windowSize.width < TABLET_BREAKPOINT;
  const elementSize = isMobileView ? 'sm' : 'md';
  const [isDetailView, setIsDetailView] = useState(false);

  // Effects
  useEffect(() => {
    return () => {
      setSelectedNotification(null);
    };
  }, [setSelectedNotification]);

  // Handlers
  const onBackTo = () => {
    if (!isMobileView) {
      window.history.back();
    } else {
      isDetailView ? setIsDetailView(false) : window.history.back();
    }
  };

  // Render
  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <div className="notifications-container">
          <div className="top-nav">
            <Button className="back-button-control" variant="tertiary" Icon={IconArrowLeft} onClick={onBackTo} size={elementSize}>
              {isMobileView ? t('notifications.cta.backMobile') : t('notifications.cta.back')}
            </Button>
          </div>
          <div className="notifications-header">
            <div className="heading">
              <Heading as="h1" size={'var(--brand-font-size--28, 28px)'}>
                {t('notifications.title')} <span className="count">({paginatedUnreadCount})</span>
              </Heading>
            </div>
            <FilterToolbar isMobileView={isMobileView} />
          </div>
          <div className="notifications-info">
            <Alert description={t('notifications.info.cleared')} showCloseIcon={false} title="" size="sm" />
          </div>
          {!isMobileView ? (
            <div className="notifications-content">
              <div className="notifications-list">
                <NotificationLister isMobileView={isMobileView} />
              </div>
              <div className="notification-detail">
                <NotificationViewer isMobileView={isMobileView} />
              </div>
            </div>
          ) : !isDetailView ? (
            <div className="notifications-list">
              <NotificationLister isMobileView={isMobileView} setIsDetailView={setIsDetailView} />
            </div>
          ) : (
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
