// src/components/Modal.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal as MCPModal } from '@mckesson/mcp-component-library';
import { closeModal } from '../../store/reducer/modalReducer';

function Modal() {
  const { isOpen, title, body, footer, onClose } = useSelector((state) => state.modalState);
  const dispatch = useDispatch();

  return (
    <MCPModal
      isOpen={isOpen}
      onClose={(e, reason) => {
        if (reason && reason === 'backdropClick') {
          return;
        }
        dispatch(closeModal());
      }}
      modalTitle={title}
      modalBody={body}
      isFooterCenterAlign={false}
      modalFooter={footer}
      modalSize={'xxs'}
    />
  );
}

export default Modal;
