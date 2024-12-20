import React from 'react';

export default function DetailSegment({ label, value, className }) {
  return (
    <div className={className}>
      <div className={'fieldName'}>{label}</div>
      <div className={'fieldValue'}>{value}</div>
    </div>
  );
}
