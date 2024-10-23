import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import styles from "./assets/DropdownMenu.module.scss";

export const DropdownMenu = (props) => {
  const { options, handleSelect, anchorEl, optionsAlign } = props;
  const refDropdown = useRef(null);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!refDropdown?.current.contains(event.target)) {
        setIsOptionsVisible(false);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);
  const hideOptions = () => {
    setIsOptionsVisible(true);
  };
  const handleOptionSelect = (e) => {
    setIsOptionsVisible(false);
    handleSelect(e);
  };
  const renderOptions = () => {
    if (options && options.length <= 0) {
      return null;
    }
    if (options && options.length === 1) {
      return (
        <div
          className={`${styles.dropdownContent} ${
            optionsAlign === "right" ? styles.alignRight : ""
          }`}
        >
          {options.map((item) => {
            return (
              <button onClick={() => handleOptionSelect(item)}>
                {item?.label}
              </button>
            );
          })}
        </div>
      );
    }
    if (options && options.length > 1) {
      return (
        <ul className={styles.dropdownContent}>
          {options.map((item) => {
            return (
              <li onClick={() => handleOptionSelect(item)}>{item?.label}</li>
            );
          })}
        </ul>
      );
    }
  };
  return (
    <div ref={refDropdown} className={styles.dropdownMenu}>
      <button onClick={hideOptions}>
        {anchorEl ? anchorEl : "Click here"}
      </button>
      {isOptionsVisible && renderOptions()}
    </div>
  );
};

DropdownMenu.propTypes = {
  options: PropTypes.array,
  optionsAlign: PropTypes.oneOf(["left", "right"]),
  anchorEl: PropTypes.any,
  handleSelect: PropTypes.func,
};
DropdownMenu.defaultProps = {
  options: [],
  optionsAlign: "left",
};
