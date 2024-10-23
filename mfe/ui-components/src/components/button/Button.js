import React from "react";
import PropTypes from "prop-types";
import {
  textStyles,
  buttonOverriddenStyles,
  TEXT_TRANSFORM_STYLES,
} from "./assets/constants/buttonStylesConstants";
import { paddingStyles } from "./assets/constants/paddingStylesConstants";
import { CommonUtils } from "../../common/utils/CommonUtils";
import { IonButton } from "../ionButton";

export const Button = (props) => {
  const {
    size,
    isODSButton,
    isModalButton,
    buttonWidth,
    textTransform,
    variant,
    children,
    onClick,
    Icon,
    iconButton,
    textButton,
    iconPosition,
    textButtonUnderlined,
    disabled,
    ...rest
  } = props;

  const computePaddingStyle = () => {
    let paddingStyle = {};

    if (CommonUtils.isNonEmptyString(buttonWidth)) {
      paddingStyle = {
        ...paddingStyle,
        width: buttonWidth,
      };
    }

    if (!isModalButton) {
      return paddingStyle;
    }

    switch (size) {
      case "lg":
        paddingStyle = {
          ...paddingStyle,
          ...paddingStyles.paddingLarge,
        };
        break;
      case "md":
        paddingStyle = {
          ...paddingStyle,
          ...paddingStyles.paddingMedium,
        };
        break;
      case "sm":
        paddingStyle = {
          ...paddingStyle,
          ...paddingStyles.paddingSmall,
        };
        break;
      case "xs":
        paddingStyle = {
          ...paddingStyle,
          ...paddingStyles.paddingExtraSmall,
        };
        break;
      default:
        paddingStyle = {
          ...paddingStyle,
        };
        break;
    }

    return paddingStyle;
  };

  const computeTextStyle = () => {
    let textStyle = {};

    if (isODSButton) {
      return textStyle;
    }

    switch (size) {
      case "lg":
        textStyle = textStyles.allCapsBoldLarge;
        break;
      case "md":
        textStyle = textStyles.allCapsBoldMedium;
        break;
      case "sm":
        textStyle = textStyles.allCapsBoldSmall;
        break;
      case "xs":
        textStyle = textStyles.allCapsBoldExtraSmall;
        break;
      default:
        textStyle = textStyles.allCapsBoldMedium;
        break;
    }
    if (
      textTransform === TEXT_TRANSFORM_STYLES.uppercase ||
      textTransform === TEXT_TRANSFORM_STYLES.lowercase ||
      textTransform === TEXT_TRANSFORM_STYLES.capitalize ||
      textTransform === TEXT_TRANSFORM_STYLES.none
    ) {
      textStyle = {
        ...textStyle,
        textTransform,
      };
    }

    if (variant === "tertiary") {
      textStyle = {
        ...textStyle,
        backgroundColor: "transparent",
        letterSpacing: "-0.016px",
      };
    }
    return textStyle;
  };

  return (
    <IonButton
      label={""}
      variant={variant}
      size={size}
      disabled={disabled}
      Icon={Icon}
      iconPosition={iconPosition}
      iconButton={iconButton}
      textButton={textButton}
      textButtonUnderlined={textButtonUnderlined}
      style={{
        ...computeTextStyle(),
        ...computePaddingStyle(),
        ...buttonOverriddenStyles,
      }}
      onClick={onClick}
      {...rest}
    >
      {children}
    </IonButton>
  );
};

Button.propTypes = {
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
  isODSButton: PropTypes.bool,
  isModalButton: PropTypes.bool,
  buttonWidth: PropTypes.string,
  textTransform: PropTypes.string,
};

Button.defaultProps = {
  label: "",
  variant: "primary",
  size: "sm",
  disabled: false,
  Icon: null,
  iconPosition: "left",
  iconButton: false,
  textButton: false,
  textButtonUnderlined: false,
  onClick: () => {
    console.log("Button Click Event.");
  },
  isODSButton: false,
  isModalButton: false,
  buttonWidth: null,
  textTransform: "uppercase",
};
