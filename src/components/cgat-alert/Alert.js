import React from 'react';
import { Alert as MCPAlert } from '@mckesson/mcp-component-library';

const Alert = ({ duration = 0, ...rest }) => <MCPAlert duration={duration} {...rest} />;

export default Alert;
