import React from 'react';
import StepHeader from './StepHeader';
import './TechIssueForm/index.scss';

const CardSelector = ({ step, title, options, value, onChange }) => {
  return (
    <div className="tech-options">
      <StepHeader step={step} title={title} />

      <div className="tech-options__grid">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.id;

          return (
            <button
              key={option.id}
              type="button"
              className={`tech-card ${isSelected ? 'tech-card--active' : ''}`}
              onClick={() => onChange(option.id)}
            >
              <div className="tech-card__icon">
                <Icon />
              </div>

              <span className="tech-card__label">{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CardSelector;
