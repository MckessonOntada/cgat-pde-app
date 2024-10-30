import React from 'react';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert" className="error-boundary">
      <h1>Something went wrong.</h1>
      {error && <p>{error.message}</p>}

      {resetErrorBoundary && <button onClick={resetErrorBoundary}>Try Again</button>}
    </div>
  );
};

export default ErrorFallback;
