import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';
export default function DetailSegment({ label, tooltip, value, className, customLabelStyles, customValueStyles, noTooltip }) {
  return (
    <div className={className}>
      <div className={`fieldName ${customLabelStyles ? customLabelStyles : ``}`}>{label}</div>
      <div className={`fieldValue ${customValueStyles ? customValueStyles : ``}`}>
        <div className="overflowing">
          {noTooltip ? value : <Tooltip body={tooltip || value}>{value}</Tooltip>}
        </div>
      </div>
    </div>
  );
}
