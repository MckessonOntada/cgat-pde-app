import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/styles/Switch.module.scss";
import { styled } from "@mui/system";
import clsx from "clsx";
import { useSwitch } from "@mui/base";
import { Label } from "../label";

const sizeMap = {
  lg: {
    switchWidth: "48px",
    switchHeight: "28px",
    thumbSize: "22px",
    thumbTop: "3px",
  },
  md: {
    switchWidth: "36px",
    switchHeight: "20px",
    thumbSize: "16px",
    thumbTop: "2px",
  },
  sm: {
    switchWidth: "30px",
    switchHeight: "18px",
    thumbSize: "14px",
    thumbTop: "2px",
  },
};

const BasicSwitchRoot = styled("span")(({ size }) => {
  const { switchWidth, switchHeight } = sizeMap[size] || sizeMap.lg; // Default to 'lg' if not provided
  return `
    font-size: 0;
    position: relative;
    display: inline-block;
    width: ${switchWidth};
    height: ${switchHeight};
    background: #BAC5CC;
    border-radius: 1.6rem;
    cursor: pointer;
    &.Switch-focusVisible {
      outline: 2px solid #007CC1;
      outline-offset: 2px;
    }
    &.Switch-disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    &.Switch-checked {
      background: #007CC1;
    }
  `;
});

const BasicSwitchInput = styled("input")`
  cursor: inherit;
  position: absolute;
  width: 100% !important;
  height: 100% !important;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 1;
  margin: 0;
  clip: inherit !important;
`;

const BasicSwitchThumb = styled("span")(({ size }) => {
  const { thumbSize, thumbTop } = sizeMap[size] || sizeMap.lg; // Default to 'lg' if not provided
  return `
    display: block;
    width: ${thumbSize};
    height: ${thumbSize};
    top: ${thumbTop};
    left: 3px;
    border-radius: 1.6rem;
    background-color: #fff;
    position: relative;
    transition: all 200ms ease;

    &.Switch-checked {
      left: calc(100% - ${thumbSize} - 3px);
      top: ${thumbTop};
      background-color: #fff;
    }
  `;
});

function BasicSwitch(props) {
  const { getInputProps, focusVisible, disabled } = useSwitch(props);
  const { checked, size, ...rest } = props;
  const stateClasses = {
    "Switch-checked": checked,
    "Switch-disabled": disabled,
    "Switch-focusVisible": focusVisible,
  };

  return (
    <BasicSwitchRoot className={clsx(stateClasses)} size={size}>
      <BasicSwitchThumb className={clsx(stateClasses)} size={size} />
      <BasicSwitchInput {...rest} {...getInputProps()} />
    </BasicSwitchRoot>
  );
}
export const Switch = ({
  handleToggle,
  id,
  value,
  label,
  labelPosition = "left",
  size = "lg", // Default size is 'lg'
  ...rest
}) => {
  const composeFormLabel = (labelPosition, isDisabled) => {
    return (
      <Label
        data-testid={id}
        htmlFor={id}
        fontSize={"var(--brand-font-size--default)"}
        fontWeight={"var(--brand-font-weight-600)"}
        letterSpacing={"-0.002rem"}
        lineHeight={"1.125rem"}
        className={`d-none d-md-block`}
      >
        {label}
      </Label>
    );
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.target.checked = !event.target.checked;
      handleToggle(event);
    }
  };

  return (
    <div className={styles.switchbox}>
      {label &&
        labelPosition === "left" &&
        composeFormLabel(labelPosition, rest.isDisabled)}
      <BasicSwitch
        checked={value}
        role="switch"
        onChange={handleToggle}
        {...rest}
        aria-checked={value}
        type="checkbox"
        id={id}
        data-check-switch=""
        size={size} // Pass size to BasicSwitch
        onKeyPress={handleKeyDown}
      />
      {label &&
        labelPosition === "right" &&
        composeFormLabel(labelPosition, rest.isDisabled)}
    </div>
  );
};

Switch.propTypes = {
  handleToggle: PropTypes.func,
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.bool,
  labelPosition: PropTypes.string,
  size: PropTypes.oneOf(["lg", "md", "sm"]), // Define valid sizes
};
