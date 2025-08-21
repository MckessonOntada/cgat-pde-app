import Alert from '@src/components/cgat-alert/Alert';
import { renderModal } from '@src/util/ModalUtil';
import React, { useState } from 'react';
import { NOTIFY_ALERT, NOTIFY_USER_EVENT_TYPE } from './Constants';
import { useTranslate } from '@src/translations/useTranslation';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import CommonUtils from '@src/util/CommonUtils';
import OrderService from '@src/api/commonService/OrderService';
import { Tooltip } from '@mckesson/mcp-component-library';

export function showSaveAsDraftConfirm({ t, onOk, onCancel }) {
  return renderModal({
    title: t('messages.header.warning'),
    bodyContent: (
      <div className="MCP-modal-body">
        <p>{t('attestation.warning')}</p>
      </div>
    ),
    footerActions: {
      cancel: {
        label: t('captions.btnCancel'),
        action: () => onCancel?.()
      },
      confirm: {
        label: t('button.caption.saveAsDraft'),
        action: () => onOk()
      }
    }
  });
}

export function showEditAlert(title, message, cancelBtnLabel) {
  renderModal({
    title,
    bodyContent: (
      <div className="MCP-modal-body">
        <p>{message}</p>
      </div>
    ),
    footerActions: {
      cancel: {
        label: cancelBtnLabel
      }
    }
  });
}

export const NotifyAlert = ({ stage, OnEdit = false, orderId, setAlert }) => {
  const [userNotified, setUserNotified] = useState(false);
  const { t } = useTranslate();
  const messages = NOTIFY_ALERT(t);
  const message = OnEdit ? t('labels.summaryEditMessage') : messages[stage];
  const eventType = NOTIFY_USER_EVENT_TYPE(t)[stage];

  const { mutate: notifyUser } = useMutation(async ({ orderId, eventType }) => await OrderService.notifyUser(orderId, eventType), {
    onSuccess: () => {
      setUserNotified(true);
    },
    onError: (error) => {
      const statusCode = error?.response?.status;
      let description = t('error.default');
      if (!(statusCode >= 400 && statusCode < 600)) {
        description = CommonUtils.getAxiosErrorMessage(error);
      }
      setAlert({
        description,
        type: 'error'
      });
    }
  });

  const strMessage = OnEdit ? (
    message
  ) : (
    <div className="info-alert-message">
      {message}{' '}
      {userNotified ? (
        <span>
          <Tooltip body={t('messages.notifyUser')}>{t('control.notifyUser')}</Tooltip>
        </span>
      ) : (
        <Link onClick={() => notifyUser({ orderId, eventType })}>{t('control.notifyUser')}</Link>
      )}
    </div>
  );

  return <Alert className="alert-container-print" type={OnEdit ? 'error' : 'info'} description={strMessage} showCloseIcon={false} />;
};
