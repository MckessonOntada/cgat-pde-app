import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/CustomCard.module.scss";

export const CustomCard = (props) => {
  const { children, className, isSelected } = props;
  return (
    <div
      className={`${styles.card_wrap} ${className} ${
        isSelected ? styles.selectedCard : styles.customcard
      }`}
      data-testid="custom-card"
    >
      {children}
    </div>
  );
};
CustomCard.propTypes = {
  children: PropTypes.any,
  className: PropTypes.any,
  isSelected: PropTypes.bool,
};
