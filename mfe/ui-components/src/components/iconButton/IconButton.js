import React from "react";
import PropTypes from "prop-types";
import { IonButton } from "../ionButton";

export const IconButton = ({
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
  ...props
}) => {
  return (
    <IonButton
      label={label}
      variant={variant}
      size={size}
      disabled={disabled}
      Icon={Icon}
      iconButton={iconButton}
      textButton={textButton}
      textButtonUnderlined={false}
      onClick={onClick}
      dataTestId={dataTestId}
      iconPosition={iconPosition}
      {...props}
    >
      {children}
    </IonButton>
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
  variant: "tertiary",
  size: "sm",
  disabled: false,
  Icon: null,
  iconPosition: "left",
  iconButton: true,
  textButton: false,
  textButtonUnderlined: false,
  onClick: () => {
    console.log("Button Click Event.");
  },
};
