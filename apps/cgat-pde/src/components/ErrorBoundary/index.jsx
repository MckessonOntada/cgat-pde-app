import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }; // Update state to show fallback UI
  }

  componentDidCatch(error, info) {
    console.error('Error caught by ErrorBoundary:', error, info);
    // logErrorToMyService(error, info.componentStack);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null }); // Reset the error state
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback ? (
        React.cloneElement(this.props.fallback, {
          error: this.state.error,
          resetErrorBoundary: this.resetErrorBoundary
        })
      ) : (
        <div>Something went wrong.</div>
      );
    }

    return this.props.children; // Render children when there's no error
  }
}

export default ErrorBoundary;
