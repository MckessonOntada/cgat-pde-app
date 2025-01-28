import React, { useState } from 'react';
import styles from './ToggleButton.module.scss';

const ToggleButton = ({ options = [], size = 'medium', onChange }) => {
  const [activeOption, setActiveOption] = useState(options[0]);

  const handleOptionClick = (option) => {
    setActiveOption(option);
    if (onChange) {
      onChange(option);
    }
  };

  return (
    <div className={`${styles.toggleButton} ${styles[size]}`}>
      {options.map((option) => (
        <div
          key={option}
          className={`${styles.option} ${activeOption === option ? styles.active : ''}`}
          onClick={() => handleOptionClick(option)}>
          {option}
        </div>
      ))}
    </div>
  );
};

export default ToggleButton;
