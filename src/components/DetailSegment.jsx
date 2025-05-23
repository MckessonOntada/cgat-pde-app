import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';
export default function DetailSegment({ label, tooltip, value, className, customLabelStyles, customValueStyles, noTooltip, direction = 'column' }) {
  const calculatedTooltip = tooltip || value;
  return (
    <div
      className={`details-segment-wrapper ${className}`}
      style={{
        flexDirection: direction
      }}>
      <div className={`fieldName ${customLabelStyles ? customLabelStyles : ``}`}>{label}</div>
      <div className={`fieldValue ${customValueStyles ? customValueStyles : ``}`}>
        <div className="overflowing">
          {noTooltip ? (
            value
          ) : typeof calculatedTooltip === 'string' ? (
            <Tooltip body={typeof calculatedTooltip === 'string' && calculatedTooltip}>{typeof value === 'string' ? <div>{value}</div> : value}</Tooltip>
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );
}
