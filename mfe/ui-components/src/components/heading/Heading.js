import React from "react";
import PropTypes from "prop-types";

export const Heading = ({
  as: Tag,
  fontSize,
  children,
  color,
  className,
  fontWeight,
  lineHeight,
  letterSpacing,
  ...props
}) => {
  const isSrOnly = className && className.includes("sr-only");
  const fontSizeMap = {
    h1: "var(--brand-font-size--24)",
    h2: "var(--brand-font-size--22)",
    h3: "var(--brand-font-size--20)",
    h4: "var(--brand-font-size--large)",
    h5: "var(--brand-font-size--default)",
    h6: "var(--brand-font-size--small)",
  };

  const style = isSrOnly
    ? {}
    : {
        fontSize: fontSize || fontSizeMap[Tag],
        color: color,
        fontWeight: fontWeight,
        lineHeight: lineHeight,
        letterSpacing: letterSpacing,
      };

  return (
    <Tag style={style} className={className} {...props}>
      {children}
    </Tag>
  );
};

Heading.propTypes = {
  as: PropTypes.oneOf(["h1", "h2", "h3", "h4", "h5", "h6"]).isRequired,
  fontSize: PropTypes.string,
  children: PropTypes.node.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
  fontWeight: PropTypes.string,
  lineHeight: PropTypes.string,
  letterSpacing: PropTypes.string,
};

Heading.defaultProps = {
  as: "h1",
};

export default Heading;
