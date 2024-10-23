import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/styles/TextError.module.scss";
import { ReactComponent as WarningIcon } from "./assets/svg/warning.svg";

export const TextError = ({
  errorMessage,
  showErrorIcon,
  id,
  size,
  translateClass,
  ...props
}) => {
  return (
    <p
      className={`${styles.textError} ${styles["errortext-" + size]} ${translateClass?.error}`}
      data-testid={"error-testid-" + id}
      id={id + "-error"}
      {...props}
    >
      {showErrorIcon && (
        <>
          <span className={styles.sr_only}>warning</span>
          <WarningIcon
            data-testid={"warning-icon"}
            className={styles.warningIcon}
          />
        </>
      )}
      {errorMessage}
    </p>
  );
};

TextError.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  showErrorIcon: PropTypes.bool,
  id: PropTypes.string,
  size: PropTypes.any,
};

TextError.defaultProps = {};
