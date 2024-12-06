import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';

function EclipsesTextcss({ str, maxWidth = 100 }) {
  return (
    <Tooltip body={str}>
      <span style={{ maxWidth: `${maxWidth}px`, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left', display: 'inline-block' }}>{str}</span>
    </Tooltip>
  );
}

export default EclipsesTextcss;
