import React from 'react';
import { useFormikContext } from 'formik';
import './index.scss';
import { techIssueOptions } from '../constants';
import StepHeader from '../StepHeader';

const TechIssueForm = () => {
  const { values, setFieldValue } = useFormikContext();

  const handleClick = (option) => {
    setFieldValue('affectedModule', option.id);
  };

  return (
    <div className="tech-options">
      <StepHeader step={2} title="Affected module" />

      <div className="tech-options__grid">
        {techIssueOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = values.affectedModule === option.id;

          return (
            <button key={option.id} type="button" className={`tech-card ${isSelected ? 'tech-card--active' : ''}`} onClick={() => handleClick(option)}>
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

export default TechIssueForm;
