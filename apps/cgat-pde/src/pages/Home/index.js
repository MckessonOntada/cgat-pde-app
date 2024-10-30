import React from 'react';

export default function Home() {
  return (
    <div>
      <h2>Home Page</h2>
      {/* Below button simulate an error and demonstrate the Error Boundary functionality */}
      <button onClick={errorBoundary}>Error Boundary</button>
    </div>
  );
}
