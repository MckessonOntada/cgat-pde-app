import React from 'react';

export default function DetailSegment({ label, value, className, customLabelStyles, customValueStyles }) {
  return (
    <div className={className}>
      <div className={`fieldName ${customLabelStyles ? customLabelStyles : ``}`}>{label}</div>
      <div className={`fieldValue ${customValueStyles ? customValueStyles : ``}`}>{value}</div>
    </div>
  );
}
