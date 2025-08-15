import { renderModal } from '@src/util/ModalUtil';
import React from 'react';

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
