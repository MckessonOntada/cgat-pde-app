import { Form } from 'formik';
import React from 'react';

export default function FormikFormWrapper({ disabled, children }) {
  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <Form onKeyDown={handleOnKeyPress}>
      <div
        onKeyDownCapture={(e) => {
          if (!disabled) return;
          e.preventDefault();
          e.stopPropagation();
        }}
        onClickCapture={(e) => {
          if (!disabled) return;
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDownCapture={(e) => {
          if (!disabled) return;
          e.preventDefault();
          e.stopPropagation();
        }}
        aria-disabled={disabled}>
        {children}
      </div>
    </Form>
  );
}
