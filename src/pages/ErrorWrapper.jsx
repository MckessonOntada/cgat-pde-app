import { Button } from '@mckesson/mcp-component-library';
import Alert from '@src/components/cgat-alert/Alert';
import React from 'react';

class ErrorWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRefresh = () => {
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="MCP-module-wrapper" style={{ padding: '24px', alignItems: 'center' }}>
          <Alert
            type="error"
            showTitle={true}
            title="Something went wrong."
            showCloseIcon={false}
            description={this.state.error && this.state.error?.message}
          />
          <Button size="md" onClick={this.handleRefresh}>
            Refresh Page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorWrapper;
