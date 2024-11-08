import { IconButton, Switch } from '@mckesson/mcp-component-library';
import React, { useState, useEffect } from 'react';
import { Label } from '@mckesson/mcp-component-library';
import view from '@src/assets/image/view.svg';
import './index.scss';

export default function Actions({ status, row, onToggleChange, onEditClick }) {
  const [isChecked, setIsChecked] = useState(status === 'ACTIVE');

  useEffect(() => {
    setIsChecked(status === 'ACTIVE');
  }, [status]);

  const handleToggle = (event) => {
    const checked = event.target.checked;
    setIsChecked(checked);

    if (onToggleChange) {
      onToggleChange(row.id, checked);
    }

    alert(checked ? 'The switch is ON!' : 'The switch is OFF!');
  };

  return (
    <div className="actionsBox">
      <img src={view} />
      <Label className="view-label">VIEW</Label>
    </div>
  );
}
