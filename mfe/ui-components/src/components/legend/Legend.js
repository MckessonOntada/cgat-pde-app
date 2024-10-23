import React from "react";
import PropTypes from "prop-types";

export const Legend = ({
  text,
  className,
  children,
  fontSize,
  fontWeight,
  styles,
  ...props
}) => {
  let style = {
    fontSize: fontSize,
    fontWeight: fontWeight,
    ...styles,
  };
  return (
    <legend style={style} className={className} {...props}>
      {children}
    </legend>
  );
};

Legend.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Legend.defaultProps = {
  className: "",
};
