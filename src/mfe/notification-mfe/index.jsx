import React, { useState } from 'react';
import useWindowSize from '@src/hooks/UseWindowSize';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import NotificationLister from './components/NotificationLister/NotificationLister';
import NotificationViewer from './components/NotificationViewer/NotificationViewer';
import FilterToolbar from './components/FilterToolbar/FilterToolbar';
import { useNotifications } from './context/NotificationsContext';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import './index.scss';

const TABLET_BREAKPOINT = 768;

const Notifications = () => {
  const windowSize = useWindowSize();
  const isMobileView = windowSize.width < TABLET_BREAKPOINT;
  const { t } = useTranslate();

  const elementSize = isMobileView ? 'sm' : 'md';

  const { notificationsCount } = useNotifications();

  const [isDetailView, setIsDetailView] = useState(false);

  const onBackTo = () => {
    if (!isMobileView) {
      window.history.back();
    } else {
      isDetailView ? setIsDetailView(false) : window.history.back();
    }
  };

  return (
    <div className="MCP-module-wrapper">
      <div className="MCP-module-body">
        <div className="notifications-container">
          <div className="top-nav">
            <Button
              className="back-button-control"
              variant="tertiary"
              Icon={IconArrowLeft}
              onClick={onBackTo}
              size={elementSize}>
              {isMobileView ? t('notifications.cta.backMobile') : t('notifications.cta.back')}
            </Button>
          </div>
          <div className="notifications-header">
            <div className="heading">
              <Heading as="h1" size={'var(--brand-font-size--28, 28px)'}>
                {t('notifications.title')}{' '}
                <span className="count">({notificationsCount})</span>
              </Heading>
            </div>
            <FilterToolbar isMobileView={isMobileView} />
          </div>
          <div className="notifications-info">
            <Alert
              description={t('notifications.info.cleared')}
              showCloseIcon={false}
              title=""
              size="sm"
            />
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
              <NotificationLister
                isMobileView={isMobileView}
                setIsDetailView={setIsDetailView}
              />
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
