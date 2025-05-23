import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';
export default function DetailSegment({ label, tooltip, value, className, customLabelStyles, customValueStyles, noTooltip }) {
  const calculatedTooltip = tooltip || value;
  return (
    <div className={className}>
      <div className={`fieldName ${customLabelStyles ? customLabelStyles : ``}`}>{label}</div>
      <div className={`fieldValue ${customValueStyles ? customValueStyles : ``}`}>
        {noTooltip ? (
          <div className="overflowing">value</div>
        ) : typeof calculatedTooltip === 'string' ? (
          <Tooltip body={typeof calculatedTooltip === 'string' && calculatedTooltip}>
            {typeof value === 'string' ? <div className="overflowing">{value}</div> : value}
          </Tooltip>
        ) : (
          <div className="overflowing">value</div>
        )}
      </div>
    </div>
  );
}
