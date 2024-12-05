import React from 'react';
import { Button, Modal, Heading } from '@mckesson/mcp-component-library';

const DiscardChangesModal = ({ heading = '', description = '', isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      id="discard-role-permissions-modal"
      isOpen={isOpen}
      onClose={onClose}
      modalTitle={heading}
      modalBody={<Heading as="h3">{description}</Heading>}
      modalFooter={
        <div className="controls">
          <Button size="md" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button size="md" variant="primary" onClick={onConfirm}>
            Okay
          </Button>
        </div>
      }
      modalSize="md"
    />
  );
};

export default DiscardChangesModal;
