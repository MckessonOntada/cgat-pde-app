import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/Divider.module.scss";

export const Divider = (props) => {
  const { orientation, className } = props;

  return (
    <>
      <hr
        className={`${styles.dividerBase} 
         ${orientation == "horizontal" ? styles.horizontal : styles.vertical} 
         ${className}`}
        data-testid="divider"
      ></hr>
    </>
  );
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
};

Divider.defaultProps = {
  orientation: "horizontal",
};
