import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/Divider.module.scss";

export const Divider = (props) => {
  const { orientation, className, color } = props;

  return (
    <>
      <hr
        className={`${styles.dividerBase} 
         ${orientation === "horizontal" ? styles.horizontal : styles.vertical} 
         ${className}`}
        style={{ borderColor: color }} // Apply color dynamically
        data-testid="divider"
      />
    </>
  );
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  className: PropTypes.string,
  color: PropTypes.string, // Add color prop validation
};

Divider.defaultProps = {
  orientation: "horizontal",
  color: "black", // Default color
};
