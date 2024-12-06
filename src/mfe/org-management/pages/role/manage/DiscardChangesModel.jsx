import React from 'react';
import { Button, Modal, Heading } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

const DiscardChangesModal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslate();
  return (
    <Modal
      id="discard-role-permissions-modal"
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Discard Changes?"
      modalBody={<Heading as="h3">You have changed role permissions. Do you still want to go back? Your changes will be discarded!</Heading>}
      modalFooter={
        <div className="controls">
          <Button size="md" variant="secondary" onClick={onClose}>
            {t('orgManagement.button.cancel')}
          </Button>
          <Button size="md" variant="primary" onClick={onConfirm}>
            {t(' orgManagement.button.okay')}
          </Button>
        </div>
      }
      modalSize="md"
    />
  );
};

export default DiscardChangesModal;
