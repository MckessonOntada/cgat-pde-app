import React from 'react';
import './index.scss';

export const ProgressBarStepper = ({ totalSteps, currentStep }) => {
  return (
    <div className="progress-indicator-bar">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isFilled = index < currentStep - 1;
        const isActive = index === currentStep - 1;

        return <div key={index} className={`progress-step ${isActive ? 'active' : ''} ${isFilled ? 'filled' : ''}`} />;
      })}
    </div>
  );
};
