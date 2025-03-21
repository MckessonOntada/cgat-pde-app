import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';
export default function DetailSegment({
  label,
  tooltip,
  value,
  className,
  customLabelStyles,
  customValueStyles,
  isTooltipRequired = true
}) {
  return (
    <div className={className}>
      <div className={`fieldName ${customLabelStyles ? customLabelStyles : ``}`}>{label}</div>
      <div className={`fieldValue ${customValueStyles ? customValueStyles : ``}`}>
        {isTooltipRequired ? (
          <div className="overflowing">
            <Tooltip body={tooltip || value}>{value}</Tooltip>
          </div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}
