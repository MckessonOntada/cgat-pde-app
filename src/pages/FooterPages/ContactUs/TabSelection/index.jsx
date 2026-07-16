import React from 'react';
import './index.scss';
import { contactReasons } from '../constants';
import { Button } from '@mckesson/mcp-component-library';
import { useFormikContext } from 'formik';
import StepHeader from '../StepHeader';

export function TabSelection() {
  const { values, setFieldValues, resetForm } = useFormikContext();
  const handleClick = (reason) => {
    resetForm({
      values: {
        reason,
        affectedModule: '',
        description: ''
      }
    });
  };

  return (
    <div className="tab-selection">
      <StepHeader step={1} title="Reason for contact" />

      <div className="tab-selection__menu">
        {contactReasons.map((reason) => {
          const isActive = values.reason === reason.id;

          return (
            <Button
              key={reason.id}
              Icon={reason.Icon}
              className={`tab-selection__option ${isActive ? 'tab-selection__option--active' : ''}`}
              variant="secondary"
              onClick={() => handleClick(reason.id)}
              size="md">
              {reason.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
