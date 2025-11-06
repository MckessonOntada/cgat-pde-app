import React from 'react';
import { Button } from '@mckesson/mcp-component-library';
import style from './style.module.scss';
const SelectedTherapyListControl = ({ therapies = [], onChange }) => {
  if (!therapies || !Array.isArray(therapies) || therapies.length === 0) return null;

  return (
    <div className={style['therapy-selection-panel']}>
      <label className={style['therapies']}>
        Therapies:&nbsp;
        <span>{therapies.map((therapy) => `${therapy.name}(${therapy.description})`).join(', ')}</span>
      </label>
      <Button variant="tertiary" onClick={onChange}>
        Change
      </Button>
    </div>
  );
};

export default SelectedTherapyListControl;
