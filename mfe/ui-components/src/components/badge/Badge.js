import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/Badge.module.scss";
import { BADGE_TYPE, BADGE_SIZE } from "./assets/constants/BadgeConstants";

export const Badge = (props) => {
  const { text, type, size, isDataTableBadge,width } = props;

  const getSize = () => {
    let classes;
    switch (size) {
      case BADGE_SIZE.SMALL:
        classes = styles.sizeSm;
        break;
      case BADGE_SIZE.MEDIUM:
        classes = styles.sizeMd;
        break;
      case BADGE_SIZE.LARGE:
        classes = styles.sizeLg;
        break;
      default:
        break;
    }
    return classes;
  };

  const getType = () => {
    let classes;
    switch (type) {
      case BADGE_TYPE.INFO:
        classes = styles.subtle_info;
        break;
      case BADGE_TYPE.SUCCESS:
        classes = styles.subtle_success;
        break;
      case BADGE_TYPE.ERROR:
        classes = styles.subtle_error;
        break;
      case BADGE_TYPE.WARNING:
        classes = styles.subtle_warning;
        break;
      case BADGE_TYPE.INFO_HIGH:
        classes = styles.high_info;
        break;
      case BADGE_TYPE.SUCCESS_HIGH:
        classes = styles.high_success;
        break;
      case BADGE_TYPE.ERROR_HIGH:
        classes = styles.high_error;
        break;
      case BADGE_TYPE.WARNING_HIGH:
        classes = styles.high_warning;
        break;
      case BADGE_TYPE.INFO_DEAFULT:
        classes = styles.info_default;
        break;
      case BADGE_TYPE.INFO_HIGH_DEAFULT:
        classes = styles.info_high_default;
        break;
      case BADGE_TYPE.ERROR_DEAFULT:
        classes = styles.error_default;
        break;
      case BADGE_TYPE.SUCCESS_DEAFULT:
        classes = styles.success_default;
        break;
      case BADGE_TYPE.WARNING_DEAFULT:
        classes = styles.warning_default;
        break;
      case BADGE_TYPE.ERROR_HIGH_DEFAULT:
        classes = styles.error_high_default;
        break;
      case BADGE_TYPE.INFO_HIGH_GREY:
        classes = styles.info_high_grey;
        break;
      case BADGE_TYPE.PRIMARY:
        classes = styles.subtle_primary;
        break;
      case BADGE_TYPE.PRIMARY_HIGH:
        classes = styles.high_primary;
        break;
      case BADGE_TYPE.PRIMARY_DEFAULT:
        classes = styles.primary_default;
        break;
      default:
        break;
    }
    return classes;
  };
  return (
    <>
      <span
        data-tag={isDataTableBadge ? "allowRowEvents" : ""}
        className={`${getType()} ${getSize()}`}
        data-testid={"badgeComp"}
        style={{width:width?width:""}}
      >
        {text}
      </span>
    </>
  );
};

Badge.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf([
    "success",
    "info",
    "error",
    "warning",
    "success-high",
    "info-high",
    "error-high",
    "warning-high",
    "info-default",
    "error-default",
    "success-default",
    "warning-default",
    "info-high-default",
    "error-high-default",
    "info-high-default",
    "info-high-grey",
    "primary",
    "primary-high",
    "primary-default",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
};

Badge.defaultProps = {
  type: "info",
  size: "md",
};
