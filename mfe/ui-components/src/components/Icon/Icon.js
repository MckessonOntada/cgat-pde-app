import React from "react";
import PropTypes from "prop-types";
import { useMemo } from "react";
import { svgs } from "../../assets/icons";

export const Icon = (props) => {
  const { src, size, fill, height, width } = props;
  const SvgIcon = useMemo(() => svgs[src], [src]);
  if (!SvgIcon) return null;

  const getSize = (size) => {
    const dimensions = {
      xs: { height: "14px", width: "14px" },
      s: { height: "16px", width: "16px" },
      m: { height: "24px", width: "24px" },
      l: { height: "32px", width: "32px" },
      xl: { height: "40px", width: "40px" },
      xxl: { height: "64px", width: "64px" },
      custom: {
        height: height ? height : "14px",
        width: width ? width : "14px",
      },
    };
    return dimensions[size];
  };

  return (
    <div
      style={{
        color: fill,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      data-testid="iconComponent"
      className={"iconComponent"}
    >
      <SvgIcon {...getSize(size)} viewBox="0 0 16 16" data-testid="svgIcon" />
    </div>
  );
};

Icon.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.oneOf(["xs", "s", "m", "l", "xl", "xxl", "custom"]),
  height: PropTypes.number,
  width: PropTypes.number,
  fill: PropTypes.string,
};

Icon.defaultProps = {
  src: "CrossButton",
  size: "m",
  fill: "#000000",
};
