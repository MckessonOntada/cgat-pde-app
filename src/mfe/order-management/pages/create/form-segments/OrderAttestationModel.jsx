import Alert from '@src/components/cgat-alert/Alert';
import { renderModal } from '@src/util/ModalUtil';
import React from 'react';
import { NOTIFY_ALERT, notifyUserByStage } from './Constants';
import { useTranslate } from '@src/translations/useTranslation';
import { Link } from 'react-router-dom';

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

export const NotifyAlert = (stage) => {
  const { t } = useTranslate();
  const stageValue = Object.values(stage)[0];
  const message = notifyUserByStage(stageValue, t);

  const strMessage = (
    <div className="info-alert-message">
      {message} <Link onClick={() => alert('Clicked!')}>Notify User</Link>
    </div>
  );
  return <Alert type="info" description={strMessage} showCloseIcon={false} />;
};
