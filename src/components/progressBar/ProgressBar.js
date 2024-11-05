import React from 'react';

const ProgressBar = ({ completed, total }) => {
  const progressWidth = (completed / total) * 100;

  return (
    <div
      style={{
        width: '100%',
        height: '6px',
        backgroundColor: 'var(--brand-color-progress-grey)',
        borderRadius: '3px',
        position: 'relative'
      }}>
      {completed !== 0 && (
        <div
          style={{
            width: `${progressWidth ? `${progressWidth}%` : ''}`,
            height: '100%',
            backgroundColor: 'var(--brand-color-progress-orange)',
            borderRadius: '3px',
            position: 'absolute',
            top: '0',
            left: '0'
          }}
        />
      )}

      {completed === total && total > 0 && (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--brand-color-progress-green)',
            borderRadius: '3px',
            position: 'absolute',
            top: '0',
            left: '0'
          }}
        />
      )}
    </div>
  );
};

export default ProgressBar;
