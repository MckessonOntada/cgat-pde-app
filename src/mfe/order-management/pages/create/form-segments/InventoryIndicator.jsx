import React from 'react';
import { Loader } from '@mckesson/mcp-component-library';

export const InventoryIndicator = ({ status }) => {
  const icons = {
    PENDING: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#C5C5C5" />
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    AVAILABLE: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#48a463" />
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    DROP_SHIP: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#d3722e" />
        <path d="M10 8h2.5a3 3 0 1 1 0 8H10V8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    OUT_OF_STOCK: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#DB3A29" />
        <path d="M12 9v5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="16" r="1.5" fill="white" />
      </svg>
    ),
    CHECKING: <div className="dot-loader"></div>
  };

  return <div className="indicator-icon">{icons[status] || icons.pending}</div>;
};
