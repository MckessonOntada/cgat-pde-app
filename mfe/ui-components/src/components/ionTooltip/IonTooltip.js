import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { Tooltip as MUITooltip } from "@mui/material";
import { tooltipClasses } from "@mui/material/Tooltip";

import tooltipStyles from "./assets/styles/IonTooltip.module.scss";

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

const HtmlTooltip = styled(({ className, variant, ...props }) => (
  <MUITooltip {...props} arrow classes={{ popper: className }} />
))(({ theme, variant }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    fontFamily: "Nunito",
    backgroundColor: getVariantColor(variant),
    color: "#1E394E",
    maxWidth: 294,
    padding: "10px 12px",
    borderRadius: "4px",
    boxShadow: "0px 2px 8px 0px rgba(38, 44, 54, 0.30)",
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: getVariantColor(variant),
    "&::before": {
      boxShadow: "0px 2px 8px 0px rgba(38, 44, 54, 0.30)",
    },
  },
}));

export const IonTooltip = ({
  children,
  body,
  title,
  variant,
  defaultIsOpen,
  placement,
  alwaysOpen,
  ...props
}) => {
  return (
    <div>
      <HtmlTooltip
        title={
          <div className={tooltipStyles.tooltipContents}>
            {title && <div className={tooltipStyles.tooltipTitle}>{title}</div>}
            <div className={tooltipStyles.tooltipBody}>{body}</div>
          </div>
        }
        placement={placement}
        variant={variant}
        open={true}
      >
        {children}
      </HtmlTooltip>
    </div>
  );
};

IonTooltip.propTypes = {
  children: PropTypes.node.isRequired,
  body: PropTypes.string.isRequired,
  title: PropTypes.string,
  variant: PropTypes.oneOf(["normal", "warning", "error"]),
  defaultIsOpen: PropTypes.bool,
  placement: PropTypes.oneOf([
    "top",
    "topStart",
    "topEnd",
    "bottom",
    "bottomStart",
    "bottomEnd",
    "leftStart",
    "left",
    "leftEnd",
    "rightStart",
    "right",
    "rightEnd",
  ]),
  alwaysOpen: PropTypes.bool, // Update the PropTypes to expect a boolean value for alwaysOpen.
};

IonTooltip.defaultProps = {
  title: "",
  variant: "normal",
  defaultIsOpen: false,
  placement: "top",
  alwaysOpen: false,
};
