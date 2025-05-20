import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';
export default function DetailSegment({
  label,
  tooltip,
  value,
  className,
  customLabelStyles,
  customValueStyles,
  noTooltip
}) {
  const calculatedTooltip = tooltip || value;
  return (
    <div className={className}>
      <div
        className={`fieldName ${customLabelStyles ? customLabelStyles : ``}`}>
        {label}
      </div>
      <div
        className={`fieldValue ${customValueStyles ? customValueStyles : ``}`}>
        <div className="overflowing">
          {noTooltip ? (
            value
          ) : typeof calculatedTooltip === 'string' ? (
            <Tooltip
              body={typeof calculatedTooltip === 'string' && calculatedTooltip}>
              {value}
            </Tooltip>
          ) : (
            value
          )}
        </div>
      </div>
    </div>
  );
}
