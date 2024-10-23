import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import styles from "./assets/styles/Dropdown.module.scss";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ReactComponent as DropdownArrow } from "./assets/svg/DropdownArrowDown.svg";
import { ReactComponent as DropdownArrowAdmin } from "./assets/svg/DropdownArrowAdmin.svg";
import { ReactComponent as DropdownArrowDisabled } from "./assets/svg/DropdownArrowDownDisabled.svg";
import { ReactComponent as InfoIcon } from "./assets/svg/info.svg";
import { ReactComponent as NoResult } from "./assets/svg/NoResult_copy.svg";
import { ReactComponent as DropdownArrowUp } from "./assets/svg/dropdownArrowUp.svg";
import { Tooltip } from "../tooltip";
import { CommonUtils } from "../../common/utils";
import { Required } from "../required";
import { Label } from "../label";
import { TextError } from "../textError";
import { ReactComponent as WarningIcon } from "../../../src/assets/svg/warningIcon.svg";

export const Dropdown = (props) => {
  const {
    id,
    value,
    label,
    onChange,
    options,
    isRequired,
    placeholder,
    showRequiredLabel,
    size,
    errorMessage,
    error,
    isDisabled,
    defaultValue,
    isShowLabel,
    menuWidthStyle,
    isReadOnly,
    isAdminDropdown,
    tooltipText,
    maxTooltipWidth,
    emptyOptionMessage,
    helperText,
    labelTemplate,
    showRequiredIcon,
    showError
  } = props;

  const inputComponent = useRef(null);
  const [position, setPosition] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const sizeToHeight = {
    lg: "168px",
    md: "168px",
    sm: "158px",
    xs: "158px",
  };
  useEffect(() => {
    setPosition(
      inputComponent.current
        ? inputComponent.current.getBoundingClientRect().left
        : 0
    );
  }, [inputComponent, window.width]);

  const handleResize = () => {
    setPosition(
      inputComponent.current
        ? inputComponent.current.getBoundingClientRect().left
        : 0
    );
    return () => window.removeEventListener("resize", handleResize);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setPosition(
      inputComponent.current
        ? inputComponent.current.getBoundingClientRect().left
        : 0
    );
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const getSizeStyle = () => {
    let style = {};

    switch (size) {
      case "xs":
        style = {
          padding: "11px 26px 11px 10px",
          fontSize: "var(--brand-font-size--small)",
          lineHeight: "var(--brand-font-size--extra-small)",
          letterSpacing: "0.001em",
        };
        break;
      case "sm":
        style = {
          padding: "5px 26px 5px 8px",
          fontSize: "var(--brand-font-size--extra-small)",
          lineHeight: "var(--brand-line-height--medium)",
          letterSpacing: "0.001em",
        };
        break;
      case "md":
        style = {
          padding: "7px 28px 7px 10px",
          fontSize: "var(--brand-font-size--small)",
          lineHeight: "var(--brand-line-height--large)",
        };
        break;
      case "lg":
        style = {
          padding: "9px 30px 9px 12px",
          fontSize: "var(--brand-font-size--default)",
          lineHeight: "var(--brand-line-height--m-large)",
          letterSpacing: "-0.001em",
        };
    }
    return {
      ...style,
      color: error
        ? "var(--brand-color-warning-orange-4)"
        : isAdminDropdown
        ? "var(--brand-color-text-black)"
        : "var(--brand-color-text-light-slate)",
    };
  };

  const getMenuItemSizeStyle = () => {
    let style = {};

    switch (size) {
      case "xs":
        style = {
          fontWeight: "var(--brand-font-weight-400)",
          fontSize: "var(--brand-font-size--extra-small)",
          lineHeight: "var(--brand-line-height--medium)",
          letterSpacing: " 0.001em",
          minHeight: "auto",
        };
        break;
      case "sm":
        style = {
          fontWeight: "var(--brand-font-weight-400)",
          fontSize: "var(--brand-font-size--extra-small)",
          lineHeight: "var(--brand-line-height--medium)",
          letterSpacing: " 0.001em",
          minHeight: "auto",
        };
        break;
      case "md":
        style = {
          fontWeight: "var(--brand-font-weight-400)",
          fontSize: "var(--brand-font-size--small)",
          lineHeight: "var(--brand-line-height--large)",
          minHeight: "auto",
        };
        break;
      case "lg":
        style = {
          fontWeight: "var(--brand-font-weight-400)",
          fontSize: "var(--brand-font-size--small)",
          lineHeight: "var(--brand-line-height--large)",
          minHeight: "auto",
        };
    }
    return {
      ...style,
    };
  };

  const dropdownTheme = createTheme({
    components: {
      MuiSelect: {
        styleOverrides: {
          root: {
            width: "100%",
            "& .MuiSelect-select": {
              fontFamily: "Nunito",
              fontStyle: "normal",
              fontWeight: isAdminDropdown
                ? "var(--brand-font-weight-600)"
                : "var(--brand-font-weight-400)",
              ...getSizeStyle(),
              minHeight: "inherit !important",
            },
            "&.Mui-focused .MuiSelect-select": {
              fontWeight: "var(--brand-font-weight-600)",
              color: "var(--brand-color-text-black)",
              borderRadius: "4px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              border: "1px solid",
              borderRadius: "4px !important",
              borderColor: error
                ? "var(--brand-color-warning-orange-4)"
                : "var(--brand-color-text-light-slate)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--brand-color-text-dark-slate)",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "2px solid var(--brand-color-secondary-active-yellow-1)",
              outline: "none",
            },
            "& .MuiSelect-icon": {
              transform: "none",
            },
            "& :focus-visible": {
              outline: "none !important",
            },
            "&.Mui-focused": {
              outline: "none",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            border: "1px solid var(--brand-color-text-dark-slate)",
            borderRadius: "4px",
            boxShadow: "none",
            marginTop: "4px",
            padding: "0px",
            width: "min-content",
          },
        },
      },
      MuiList: {
        styleOverrides: {
          root: {
            padding: "0px",
            maxHeight: sizeToHeight[size],
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            padding: "9px 16px",
            borderBottom: "1px solid var(--brand-color-text-cool-grey)",
            color: "var(--brand-color-text-dark-slate)",
            whiteSpace: "unset",
            wordBreak: "break-word",
            fontFamily: "Nunito",
            fontStyle: "normal",
            ...getMenuItemSizeStyle(),
            "&:last-child": {
              borderBottom: "none",
            },
            "& span.sub-label": {
              color: "var(--brand-color-text-light-slate) !important",
              fontWeight: "var(--brand-font-weight-400) !important",
            },
            "&.Mui-focusVisible": {
              outline: "none !important",
              background: "var(--brand-color-background-white)",
              color: "var(--brand-color-text-black)",
              fontWeight: "var(--brand-font-weight-600)",
            },
            "&.Mui-focusVisible.Mui-selected": {
              outline: "none !important",
              background: "var(--brand-color-secondary-active-yellow-3)",
              color: "var(--brand-color-text-black)",
              fontWeight: "var(--brand-font-weight-600)",
            },
            "&.Mui-selected": {
              outline: "none !important",
              background:
                "var(--brand-color-secondary-active-yellow-3) !important",
              color: "var(--brand-color-text-black)",
              fontWeight: "var(--brand-font-weight-600)",
            },
            "&.Mui-selected span.sub-label": {
              color: "var(--brand-color-text-black) !important",
              fontWeight: "var(--brand-font-weight-400) !important",
            },
            "&:hover": {
              outline: "none !important",
              background: "var(--brand-color-background-white)",
              color: "var(--brand-color-text-black)",
              fontWeight: "var(--brand-font-weight-600)",
            },
          },
        },
      },
    },
  });

  const prefilledDisableStyle = {
    ".Mui-disabled": {
      background: "var(--brand-color-cool-blue)",
      "-webkit-text-fill-color":
        "var(--brand-color-background-light-slate) !important",
      cursor: "not-allowed",
      color: "var(--brand-color-background-light-slate) !important",
    },
    ".MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input.Mui-disabled":
      { border: "1px solid" },
  };
  const disableStyle = {
    ".Mui-disabled": { background: "var(--brand-color-cool-blue)" },
  };

  const renderMenuItems = () => {
    if (!CommonUtils.isNonEmptyArray(options)) {
      return (
        <ul className={styles.emptyMenuContainer}>
          <li
            className={styles.emptyMenuItem}
            tabIndex={0}
            key={id + "-opt-empty"}
            style={{
              ...getMenuItemSizeStyle(),
            }}
          >
            <NoResult className={styles.emptyMenuIcon} />
            <span className={styles.emptyMenuItemMessage}>
              {emptyOptionMessage}
            </span>
          </li>
        </ul>
      );
    }
    return options.map((option, index) => {
      const { label, value, endLabel } = option;

      if (endLabel) {
        return (
          <MenuItem key={id + "-opt-" + index} value={value}>
            <span className={styles.endLabelContainer}>
              <span className={styles.endLabel}>{label}</span>
              <span className={styles.endLabelSuffix}>{endLabel}</span>
            </span>
          </MenuItem>
        );
      }

      return (
        <MenuItem key={id + "-opt-" + index} value={value}>
          <span>
            {label}{" "}
            {option.subLabel && (
              <span className={"sub-label"}>{option.subLabel}</span>
            )}
          </span>
        </MenuItem>
      );
    });
  };

  const renderArrowIcon = () => {
    if (isOpen) {
      return DropdownArrowUp;
    }
    if (isReadOnly) {
      return DropdownArrow;
    }

    if (isAdminDropdown) {
      return DropdownArrowAdmin;
    }

    return DropdownArrow;
  };
  const getAriaDescribedBy = () => {
    let describedBy = "";

    if (helperText) {
      describedBy += `dropdown-helpertext-${id} `;
    }
    if (errorMessage) {
      describedBy += `${id}-error`;
    }
    return describedBy.trim();
  };

  return (
    <div
      data-testid={"dropdown-container-" + id}
      style={{ marginTop: !label && "4px" }}
    >
      {isShowLabel && (
        <Label
          id={"dropdown-label-" + id}
          htmlFor={"dropdown-" + id}
          data-testid={"dropdown-label-testid-" + id}
          labelTemplate={labelTemplate}
          className={`${styles.labelContainer}  ${styles["size-" + size]} ${
            showRequiredLabel ? styles.showRequiredLabel : ""
          }`}
        >
          {label}
          {isRequired && label && showRequiredIcon && (
            <Required id={id} isLegend={showRequiredLabel} />
          )}
          {tooltipText && (
            <Tooltip
              body={tooltipText}
              key={"dropdown-tooltip-" + id}
              placement="top"
              maxW={maxTooltipWidth ? maxTooltipWidth : ""}
              alignText="left"
            >
              <span
                type="button"
                aria-label="information"
                className={styles.ml5}
              >
                <InfoIcon />
              </span>
            </Tooltip>
          )}
        </Label>
      )}
      {helperText && (
        <p
          id={"dropdown-helpertext-" + id}
          htmlFor={"dropdown-" + id}
          data-testid={"dropdown-label-testid-" + id}
          className={styles.helperTextLabel}
        >
          {helperText}
        </p>
      )}
      <ThemeProvider theme={dropdownTheme}>
        <Select
          ref={inputComponent}
          className={`${!value ? "" : styles.hasValue} ${
            !error ? "" : styles.hasError
          }`}
          MenuProps={{
            PaperProps: {
              "data-testid": "dropdown-paper-" + id,
              sx: {
                left: `${position}px !important`,
                maxWidth: menuWidthStyle,
              },
            },
          }}
          sx={isReadOnly ? prefilledDisableStyle : disableStyle}
          labelId={"dropdown-label-" + id}
          id={"dropdown-" + id}
          data-testid={"dropdown-select-" + id}
          value={value}
          IconComponent={renderArrowIcon()}
          displayEmpty
          defaultValue={defaultValue}
          disabled={isDisabled || isReadOnly}
          readOnly={isReadOnly}
          renderValue={(value) => {
            if (!CommonUtils.isNonEmptyArray(options))
              return <span>No options available </span>;
            if (!value) return placeholder;

            let selectedOpt = options?.find((opt) => opt.value === value);

            return selectedOpt ? (
              <span>
                {selectedOpt.label ? selectedOpt.label : ""}
                {selectedOpt.subLabel && (
                  <span className={"sub-label"}>{selectedOpt.subLabel}</span>
                )}
              </span>
            ) : (
              ""
            );
          }}
          onChange={(e) => onChange(e.target.value)}
          onOpen={(e) => handleOpen()}
          onClose={() => handleClose()}
          inputProps={{
            "aria-describedby": getAriaDescribedBy(),
          }}
          SelectDisplayProps={{ "aria-invalid": !!errorMessage }}
        >
          {renderMenuItems()}
        </Select>
        {errorMessage && showError && (
          <TextError errorMessage={errorMessage} showErrorIcon id={id} />
        )}
      </ThemeProvider>
    </div>
  );
};

Dropdown.propTypes = {
  id: PropTypes.string.isRequired,
  helperMessage: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool, // Handles whether or not to show a red required indicator next to the dropdown label.
  showRequiredLabel: PropTypes.bool, // will show the required text and will be placed to right end of the label.
  label: PropTypes.string.isRequired, // Label to show next to the dropdown.
  placeholder: PropTypes.string, //Options are: top, left
  value: PropTypes.string,
  options: PropTypes.array.isRequired,
  size: PropTypes.oneOf(["lg", "md", "sm", "xs"]).isRequired,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  isShowLabel: PropTypes.bool,
  menuWidthStyle: PropTypes.string,
  isReadOnly: PropTypes.bool,
  tooltipText: PropTypes.any,
  helperText: PropTypes.string,
  labelTemplate: PropTypes.string,
  showRequiredIcon: PropTypes.string,
  showError: PropTypes.bool
  /**
     * Default value for the dropdown 
     * value= {
            label: 'Option 1',
            value: 'option-1'
          }
     */
};

Dropdown.defaultProps = {
  isRequired: false,
  placeholder: "Select",
  showRequiredLabel: false,
  size: "sm",
  isShowLabel: true,
  menuWidthStyle: "inherit",
  isReadOnly: false,
  isAdminDropdown: false,
  emptyOptionMessage: "No data to display",
  helperText: "",
  labelTemplate: "default",
  showRequiredIcon: true,
  showError: true
};
