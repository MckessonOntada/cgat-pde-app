import React from 'react';
import './ToggleButton.scss'; // Importing the CSS file

const ToggleButtonGroup = ({ value, onChange, exclusive = false, children }) => {
  const handleToggle = (newValue) => {
    if (exclusive) {
      onChange(value === newValue ? null : newValue);
    } else {
      const newSelection = value.includes(newValue) ? value.filter((item) => item !== newValue) : [...value, newValue];
      onChange(newSelection);
    }
  };

  return (
    <div className="toggle-button-group">
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          selected: exclusive ? value === child.props.value : value.includes(child.props.value),
          onChange: handleToggle
        })
      )}
    </div>
  );
};

export default ToggleButtonGroup;
