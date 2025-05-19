import React, { useState } from 'react';
import { useTranslate } from '@src/translations/useTranslation';
import { Heading, Button, Alert } from '@mckesson/mcp-component-library';
import NotificationLister from './components/NotificationLister/NotificationLister';
import NotificationViewer from './components/NotificationViewer/NotificationViewer';
import FilterToolbar from './components/FilterToolbar/FilterToolbar';
import { useNotifications } from './context/NotificationsContext';
import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';
import './index.scss';

const Notifications = () => {
  const { t } = useTranslate();

  const { notificationsCount } = useNotifications();

  const onBackTo = () => {
    window.history.back();
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
              size="md">
              {t('notifications.cta.back')}
            </Button>
          </div>
          <div className="notifications-header">
            <div className="heading">
              <Heading as="h1" size={'var(--brand-font-size--28, 28px)'}>
                {t('notifications.title')}{' '}
                <span className="count">({notificationsCount})</span>
              </Heading>
            </div>
            <FilterToolbar />
          </div>
          <div className="notifications-info">
            <Alert
              description={t('notifications.info.cleared')}
              showCloseIcon={false}
              title=""
              size="sm"
            />
          </div>
          <div className="notifications-content">
            <div className="notifications-list">
              <NotificationLister />
            </div>
            <div className="notification-detail">
              <NotificationViewer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
