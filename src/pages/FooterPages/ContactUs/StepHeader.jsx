import React from 'react';
import './index.scss';

const StepHeader = ({ step, title }) => {
  return (
    <div className="step-header">
      <div className="step-header__number">{step}</div>

      <h2 className="step-header__title">{title}</h2>
    </div>
  );
};

export default StepHeader;
