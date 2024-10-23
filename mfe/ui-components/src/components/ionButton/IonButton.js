import React from "react";
import PropTypes from "prop-types";
// import { Icon } from "../Icon/Icon";
import styles from "./assets/styles/IonButton.module.scss";
import { SvgIcon } from "@mui/material";
import { CommonUtils } from "../../common/utils";
// import { ReactComponent as StarIcon } from "../../../src/assets/svg/info.svg";
// import { ReactComponent as StarIcon } from "../../../src/assets/icons/assets/svg/commentsIndicator.svg";
/**
 * Button Component for UI interaction.
 */
export const IonButton = ({
  label,
  variant,
  size,
  disabled,
  Icon,
  iconPosition,
  iconButton,
  textButton,
  textButtonUnderlined,
  children,
  onClick,
  dataTestId,
  className,
  iconDefaultColor,
  ...props
}) => {
  const iconSizeValue = () => {
    switch (size) {
      case "lg":
        return { height: 16, width: 16 };
      case "md":
        return { height: 14, width: 14 };
      case "sm":
        return { height: 12, width: 12 };
      case "xs":
        return { height: 10, width: 10 };
      default:
        return { height: 14, width: 14 };
    }
  };

  const iconFillValue = () => {
    switch (variant) {
      case "primary":
        return "#FFFFFF";
      case "secondary":
        return "#007CC1";
      case "tertiary":
        return "#007CC1";
      default:
        return "#FFFFFF";
    }
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${
        textButton
          ? `${styles.textButtonBaseStyles}  ${
              textButtonUnderlined && styles.textButtonUnderlined
            }`
          : `${styles.baseStyles} ${
              !iconDefaultColor ? styles.currentcolor : ""
            } ${styles[variant]} ${
              iconButton
                ? `${styles[size]} ${styles[`${size}IconButton`]}`
                : styles[size]
            }`
      } ${CommonUtils.isNonEmptyString(className) ? className : ""}`}
      data-testid={dataTestId}
      {...props}
    >
      <div className={`${styles.buttonWrapper} ${styles[size]}`}>
        {!iconButton && Icon && iconPosition == "left" && (
          <div className={styles.icon} style={{ color: iconFillValue() }}>
            {Icon && (
              <SvgIcon
                component={Icon}
                sx={{ ...iconSizeValue() }}
                inheritViewBox
              />
            )}
          </div>
        )}
        {iconButton ? (
          <div className={styles.icon} style={{ color: iconFillValue() }}>
            {Icon && (
              <SvgIcon
                component={Icon}
                sx={{ ...iconSizeValue() }}
                inheritViewBox
              />
            )}
          </div>
        ) : <div className="text-wrap">{(
          children || label
        )}</div>}
        {!iconButton && Icon && iconPosition == "right" && (
          <div className={styles.icon} style={{ color: iconFillValue() }}>
            {Icon && (
              <SvgIcon
                component={Icon}
                sx={{ ...iconSizeValue() }}
                inheritViewBox
              />
            )}
          </div>
        )}
      </div>
    </button>
  );
};

IonButton.propTypes = {
  /**
   * Contents of Button.
   */
  label: PropTypes.string,
  /**
   * Variation of the Button.
   * Can be one of the following:
   */
  variant: PropTypes.oneOf(["primary", "secondary", "tertiary"]),
  /**
   * Size of Button.
   * Can be one of the following:
   */
  size: PropTypes.oneOf(["lg", "md", "sm", "xs"]),
  /**
   * Active State of Button. Accepts Boolean value.
   */
  disabled: PropTypes.bool,
  /**
   * Icon to display on button. Any SVG element/component can be passed as an icon.
   */
  Icon: PropTypes.any,
  /**
   * Position of Icon.
   */
  iconPosition: PropTypes.oneOf(["left", "right"]),
  /**
   * If only Icon is to be displayed then "iconButton" Parameter should be set to true else false.
   */
  iconButton: PropTypes.bool,
  /**
   * If only Text as a link is to be displayed then "textButton" Parameter should be set to true else false.
   */
  textButton: PropTypes.bool,
  /**
   * If Text Button should have a underline, "textButtonUnderlined" Parameter should be set to true else false.
   */
  textButtonUnderlined: PropTypes.bool,
  /**
   * Children can be used to provide custom content.
   */
  children: PropTypes.node,
  onClick: PropTypes.func, // Add onClick prop type
};

IonButton.defaultProps = {
  label: "",
  variant: "primary",
  size: "sm",
  disabled: false,
  Icon: null,
  iconPosition: "left",
  iconButton: false,
  textButton: false,
  textButtonUnderlined: false,
  iconDefaultColor: false,
  onClick: () => {
    console.log("Button Click Event.");
  },
};
