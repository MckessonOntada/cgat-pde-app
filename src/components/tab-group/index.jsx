import React from 'react';
import './Tab.scss';

const ToggleButtonGroup = ({ value, onChange, exclusive = false, children }) => {
  const handleToggle = (newValue) => {
    if (exclusive) {
      onChange(newValue && value === newValue ? value : newValue);
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
