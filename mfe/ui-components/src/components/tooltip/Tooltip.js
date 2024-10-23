import React, { useState } from "react";
import PropTypes from "prop-types";
import tooltipStyles from "./assets/styles/Tooltip.module.scss";
import { styled } from "@mui/material/styles";
import { Tooltip as MUITooltip } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";
import { CommonUtils } from "../../common/utils";

const getVariantColor = (variant) => {
  switch (variant) {
    case "normal":
      return "#F2F6FA";
    case "warning":
      return "#F9E6CF";
    case "error":
      return "#F9E9E8";
    default:
      return "#F2F6FA";
  }
};

const HtmlTooltip = styled(({ className, variant, width, maxW, ...props }) => (
  <MUITooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, variant, width, maxW }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontFamily: "Nunito",
    backgroundColor: getVariantColor(variant),
    color: "#1E394E",
    width: width ? width : "",
    maxWidth: maxW ? maxW : "fit-content",
    padding: "10px 12px",
    borderRadius: "4px",
    boxShadow: "0px 2px 8px 0px rgba(38, 44, 54, 0.30)",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: getVariantColor(variant),
    fontSize: '14px',
    "&::before": {
      boxShadow: "0px 2px 8px 0px rgba(38, 44, 54, 0.30)",
    },
  },
}));

export const Tooltip = ({
  body,
  children,
  defaultIsOpen,
  placement,
  title,
  variant,
  isDisabled,
  openDelay,
  alignText,
  leaveDelay,
  width,
  maxW,
  ...props
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
      <HtmlTooltip
        title={
          <div className={`${tooltipStyles["tooltipContents-" + alignText]}`}>
            {title && <div className={tooltipStyles.tooltipTitle}>{title}</div>}
            <div className={tooltipStyles.tooltipBody}>{body}</div>
          </div>
        }
        placement={placement}
        variant={variant}
        open={
          (CommonUtils.isNonNullObject(body) ||
            CommonUtils.isNonEmptyString(body)) &&
          (defaultIsOpen ? true : showTooltip)
        }
        onMouseEnter={() => !isDisabled && setShowTooltip(true)}
        onMouseLeave={() => {
          if (defaultIsOpen) !isDisabled && setShowTooltip(true);
          else setShowTooltip(false);
        }}
        disableHoverListener={isDisabled}
        data-testid={`tooltip-${variant}`}
        enterDelay={openDelay}
        leaveDelay={leaveDelay}
        width={width}
        maxW={maxW}
      >
        {children}
      </HtmlTooltip>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  body: PropTypes.any,
  title: PropTypes.string,
  variant: PropTypes.oneOf(["normal", "warning", "error"]),
  defaultIsOpen: PropTypes.bool,
  placement: PropTypes.oneOf([
    "top",
    "top-start",
    "top-end",
    "bottom",
    "bottom-start",
    "bottom-end",
    "left-start",
    "left",
    "left-end",
    "right-start",
    "right",
    "right-end",
  ]),
  size: PropTypes.string,
  isDisabled: PropTypes.bool,
  openDelay: PropTypes.number,
  maxW: PropTypes.string,
  alignText: PropTypes.string, // Update the PropTypes to expect a boolean value for alwaysOpen.
};

Tooltip.defaultProps = {
  title: "",
  variant: "normal",
  size: "standard",
  placement: "top",
  isDisabled: false,
  alignText: "center",
  defaultIsOpen: false,
};
