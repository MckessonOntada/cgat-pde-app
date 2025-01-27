import React, { useState } from 'react';
import styles from './ToggleButton.module.scss';

const ToggleButton = ({ options = [], value, size = 'medium', onChange }) => {
  const [activeOption, setActiveOption] = useState(value || options[0]);

  const handleOptionClick = (option) => {
    setActiveOption(option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className={`${styles.toggleButton} ${styles[size]}`}>
      {options.map((option) => {
        return (
          <div
            key={option}
            className={`${styles.option} ${activeOption === option ? styles.active : ''}`}
            onClick={() => handleOptionClick(option)}>
            {option}
          </div>
        );
      })}
    </div>
  );
};

export default ToggleButton;
