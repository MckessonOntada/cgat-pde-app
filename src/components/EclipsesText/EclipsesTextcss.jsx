import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';

function EclipsesTextcss({ tooltip, str, maxWidth }) {

  const style = {
    ...( maxWidth ? { maxWidth: `${maxWidth}px` } : {} ),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    display: 'inline-block'
  }

  return (
    <Tooltip body={tooltip || str}>
      <span
        style={style}>
        {str || '-'}
      </span>
    </Tooltip>
  );
}

export default EclipsesTextcss;
