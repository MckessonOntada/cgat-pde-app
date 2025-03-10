import React from 'react';
import { Tooltip } from '@mckesson/mcp-component-library';

function EclipsesText({ str, maxLength = 30 }) {
  return <span>{str.length > maxLength ? <Tooltip body={str}>{str.slice(0, maxLength) + '...'}</Tooltip> : str || '-'}</span>;
}

export default EclipsesText;
