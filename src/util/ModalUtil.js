import React from 'react';
import { Button } from '@mckesson/mcp-component-library';

import { openModal, closeModal } from '../store/reducer/modalReducer';
import store from '../store/store';

export function renderModal({ title, bodyContent, footerActions, modalClose }) {
  const modalBody = <div>{bodyContent}</div>;

  const modalFooter = footerActions ? (
    footerActions?.custom ? (
      footerActions.custom
    ) : (
      <>
        {footerActions?.cancel && (
          <Button variant="secondary" size="md" isModalButton={true} onClick={() => store.dispatch(closeModal())}>
            {footerActions.cancel.label || 'Cancel'}
          </Button>
        )}
        {footerActions?.confirm && (
          <Button
            dataTestId={'apply-confirm'}
            size={'md'}
            isModalButton={true}
            variant="primary"
            onClick={() => {
              try {
                footerActions.confirm.action();
                store.dispatch(closeModal());
              } catch (err) {}
            }}>
            {footerActions.confirm.label || 'Confirm'}
          </Button>
        )}
        {footerActions?.continue && (
          <Button
            dataTestId={'apply-continue'}
            size={'md'}
            isModalButton={true}
            variant="primary"
            onClick={() => {
              try {
                footerActions.continue.action();
                store.dispatch(closeModal());
              } catch (err) {}
            }}>
            {footerActions.continue.label || 'continue'}
          </Button>
        )}
      </>
    )
  ) : null;

  store.dispatch(
    openModal({
      title,
      body: modalBody,
      footer: modalFooter,
      onClose: modalClose
    })
  );
}
