import React, { useState } from 'react';
import styles from './ToggleButton.module.scss';

const ToggleButton = ({ options = [], value, isReadOnly, size = 'medium', onChange }) => {
  const [activeOption, setActiveOption] = useState(value || options[0]);

  React.useEffect(() => {
    if (activeOption !== value) setActiveOption(value);
  }, [value]);

  const handleOptionClick = (option) => {
    if (!isReadOnly) {
      setActiveOption(option);
      if (onChange) {
        onChange(option);
      }
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
