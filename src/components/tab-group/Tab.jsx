import React from 'react';
import './Tab.scss';

const ToggleButton = ({ selected, onChange, disabled, children, value }) => {
  return (
    <button
      className={`toggle-button ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={() => !disabled && onChange(value)}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default ToggleButton;
