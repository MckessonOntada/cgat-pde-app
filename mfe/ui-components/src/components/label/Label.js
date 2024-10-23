import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/Label.module.scss";

export const Label = ({
  htmlFor,
  text,
  className,
  fontSize,
  color,
  fontWeight,
  lineHeight,
  letterSpacing,
  children,
  labelTemplate,
  translateClass,
  customStyles,
  ...props
}) => {
  let style = {
    fontSize: fontSize,
    color: color,
    fontWeight: fontWeight,
    lineHeight: lineHeight,
    letterSpacing: letterSpacing,
    ...customStyles,
  };
  const labelVarients = {
    default: styles.default,
    thick: styles.thick,
  };
  return (
    <label
      htmlFor={htmlFor}
      className={`${className} ${labelVarients[labelTemplate]} ${translateClass?.label}`}
      style={style}
      {...props}
    >
      {children}
    </label>
  );
};

Label.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  fontSize: PropTypes.string,
  color: PropTypes.string,
  fontWeight: PropTypes.string,
  lineHeight: PropTypes.string,
  letterSpacing: PropTypes.string,
  labelTemplate: PropTypes.any,
};

Label.defaultProps = {
  className: "",
};
