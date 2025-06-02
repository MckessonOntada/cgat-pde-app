import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
export default function DetailSegment({ maxLength, label, tooltip, value, className, customLabelStyles, customValueStyles, noTooltip, direction = 'column' }) {
  let cellValue = value;
  const [isExpanded, setIsExpanded] = React.useState(false);

  const needControlledTrim = React.useMemo(
    () => maxLength && Math.abs(maxLength) > 0 && typeof value === 'string' && value.length > maxLength,
    [maxLength, value]
  );

  if (needControlledTrim) {
    if (!isExpanded) {
      cellValue = `${value.substring(0, maxLength)}...`;
    }
  }

  if (!noTooltip) {
    const calculatedTooltip = tooltip || value;
    cellValue = <Tooltip body={typeof calculatedTooltip === 'string' && calculatedTooltip}>{cellValue}</Tooltip>;
  }

  return (
    <div className={`details-segment-wrapper ${className} ${direction}`}>
      <div className={`fieldName ${customLabelStyles ? customLabelStyles : ``}`}>{label}</div>
      <div className={`fieldValue ${isExpanded ? 'inline' : 'normal'} ${customValueStyles ? customValueStyles : ``}`}>
        <span className={`${!isExpanded ? 'overflowing' : ''} `}>{cellValue}</span>
        {needControlledTrim && (
          <span>
            <Link onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? 'Show Less' : 'Show More'}</Link>
          </span>
        )}
      </div>
    </div>
  );
}
