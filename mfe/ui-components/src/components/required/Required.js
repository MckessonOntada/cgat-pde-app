import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/Required.module.scss";

export const Required = ({id, requiredLabel, isLegend, translateClass }) => {
  return isLegend ? (
    <span data-testid={"reqCompo-" + id} className={`${styles.requiredText} ${translateClass?.requiredLabel}`}>
      <span
        className={`${styles.requiredIcon} ${isLegend && styles.labelAlign}`}
      >
        &#x2731;
      </span>
       {requiredLabel}
    </span>
  ) : (
   <>
    <span className={styles.sr_only}>Required</span>
    <span data-testid={"reqCompo-" + id} className={`${styles.requiredIcon}`}>&#x2731;</span>
   </>
  );
};

Required.propTypes = {
  isLegend: PropTypes.bool,
  requiredLabel: PropTypes.string,
};
Required.defaultProps = {
  requiredLabel: "Required",
};
