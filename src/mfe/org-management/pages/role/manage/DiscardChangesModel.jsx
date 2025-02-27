import React from 'react';
import { Button, Modal, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

const DiscardChangesModal = ({ heading = '', description = '', isOpen, onClose, onConfirm }) => {
  const { t } = useTranslate();
  return (
    <Modal
      id="discard-role-permissions-modal"
      isOpen={isOpen}
      onClose={onClose}
      modalTitle={heading}
      modalBody={
        <div className="MCP-modal-body">
          <p>{description}</p>
        </div>
      }
      modalFooter={
        <div className="controls">
          <Button size="md" variant="secondary" onClick={onClose}>
            {t('orgManagement.button.cancel')}
          </Button>
          <Button size="md" variant="primary" onClick={onConfirm}>
            {t('orgManagement.button.OK')}
          </Button>
        </div>
      }
      modalSize="md"
    />
  );
};

export default DiscardChangesModal;
