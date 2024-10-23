import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./assets/styles/InputField.module.scss";
import { CommonUtils } from "../../common/utils";
import { Required } from "../required";
import InfoIcon from "../../assets/svg/info.svg";
import { Tooltip } from "@mui/material";
import { Label } from "../label";
import { TextError } from "../textError";
export const InputField = (props) => {
  const {
    id,
    value,
    type,
    displayType,
    name,
    label,
    isRequired,
    isDisabled,
    isReadOnly,
    errors,
    validationFn,
    onChangeFn,
    onBlurFn,
    register,
    tooltipText,
    placeholder,
    maxLength,
    size,
    accept,
    autoFocus,
    requiredLabel,
    errorTextElipsis,
    maxCharLimit,
    isShowCharacterLimit,
    min,
    max,
    preventCharacters,
    helperText,
    hidePlaceHolder,
    labelTemplate,
    translateClass,
    isShowLabel,
    showError
  } = props;

  const [contentLength, setContentLength] = useState(0);

  const computeSize = () => {
    let inputSize = styles[`${errors?.[name] ? "sizeLgError" : "sizeLg"}`];
    switch (size) {
      case "lg":
        inputSize = styles[`${errors?.[name] ? "sizeLgError" : "sizeLg"}`];
        styles.sizeLg;
        break;
      case "md":
        inputSize = styles[`${errors?.[name] ? "sizeMdError" : "sizeMd"}`];
        styles.sizeMd;
        break;
      case "sm":
        inputSize = styles[`${errors?.[name] ? "sizeSmError" : "sizeSm"}`];
        styles.sizeSm;
        break;
      default:
        break;
    }
    return inputSize;
  };

  const computeIconStyle = () => {
    if (!errors?.[name]) {
      return "";
    }
    let iconStyle = styles.iconLg;
    switch (size) {
      case "lg":
        iconStyle = styles.iconLg;
        break;
      case "md":
        iconStyle = styles.iconMd;
        break;
      case "sm":
        iconStyle = styles.iconSm;
        break;
      default:
        break;
    }
    return iconStyle;
  };

  let tooltipUI = null;
  if (tooltipText) {
    tooltipUI = (
      <Tooltip body={tooltipText} key={"input-tooltip-" + id} placement="top">
        <span aria-label="information" className={`${styles.alignCenter}`}>
          <InfoIcon />
        </span>
      </Tooltip>
    );
  }

  useEffect(() => {
    setContentLength(props?.value ? props.value.length : 0);
  }, [value]);

  const renderCharLimit = () => {
    if (contentLength === 0) {
      return `Maximum ${maxCharLimit} characters`;
    }

    if (contentLength === maxCharLimit) {
      return `Character limit reached (${contentLength}/${maxCharLimit})`;
    }

    return `Maximum ${maxCharLimit} characters (${contentLength}/${maxCharLimit})`;
  };

  const handleKeyPress = (event) => {
    if (
      preventCharacters &&
      preventCharacters.length &&
      preventCharacters.includes(event.key)
    ) {
      event.preventDefault();
    }
  };
  const getAriaDescribedBy = () => {
    let describedBy = "";

    if (helperText) {
      describedBy += `input-helpertext-${id} `;
    }
    if (errors?.[name]) {
      describedBy += `${id}-error`;
    }
    return describedBy.trim();
  };

  return (
    <div>
      {isShowLabel && label && (
        <div
          className={styles.labelContainer}
          style={{ position: requiredLabel ? "relative" : "" }}
        >
          <Label
            htmlFor={"input-" + id}
            labelTemplate={labelTemplate}
            data-testid={"label-testid-" + id}
            className={`${styles.labelText}  ${requiredLabel && styles.dFlex}`}
            {...props}
          >
            {label}
            {isRequired && <Required id={id} isLegend={requiredLabel} />}
            {tooltipUI}
          </Label>
        </div>
      )}
      {helperText && (
        <div
          className={`${styles.labelContainer} ${translateClass?.helperText}`}
          style={{ justifyContent: requiredLabel ? "space-between" : "start" }}
        >
          <p id={"input-helpertext-" + id} className={styles.helperTextLabel}>
            {helperText}
          </p>
        </div>
      )}
      <div className={`${styles.inputFieldContainer}`}>
        <input
          id={"input-" + id}
          name={name}
          // aria-required={isRequired} //adding sr-only required text in required component
          onInput={(e) => {
            type === "number"
              ? (e.target.value = e.target.value.slice(0, maxLength))
              : {};
          }}
          aria-describedby={getAriaDescribedBy()}
          aria-invalid={errors?.[name] ? true : false}
          data-testid={"input-testid-" + id}
          type={type}
          className={`${styles.inputFieldWrapper} ${computeSize()} ${
            styles[displayType]
          } ${errors?.[name] ? styles[displayType + "Error"] : ""}
          ${errors?.[name] ? styles.icon : ""} ${computeIconStyle()}
          `}
          disabled={isDisabled}
          readOnly={isReadOnly}
          {...register(name, {
            validate: (value) =>
              isDisabled || isReadOnly ? null : validationFn(value),
            onChange: () =>
              isDisabled || isReadOnly ? null : onChangeFn(name),
            onBlur: (e) =>
              isDisabled || isReadOnly ? null : onBlurFn(name, e),
          })}
          placeholder={hidePlaceHolder ? "" : placeholder ? placeholder : label}
          maxLength={maxLength ? maxLength.toString() : ""}
          autoFocus={autoFocus}
          onKeyDown={handleKeyPress}
          {...(type === "file" && { accept: accept })}
          {...(type === "number" && { min: min, max: max })}
        />
      </div>

      {errors?.[name] && showError && (
        <TextError
          errorMessage={
            errorTextElipsis ? (
              <>
                <Tooltip
                  body={errors?.[name]?.message}
                  placement="right"
                  variant="error"
                >
                  <div
                    className={`${styles.errorText}  ${styles.errorTextElipsis}`}
                  >
                    {errors?.[name]?.message}
                  </div>
                </Tooltip>
              </>
            ) : (
              <>{errors?.[name]?.message}</>
            )
          }
          id={id}
          {...props}
        />
      )}
      {isShowCharacterLimit && (
        <div
          className={`${styles.maxCharLabel} ${
            contentLength === maxCharLimit ? styles.error : ""
          }`}
          style={{
            justifyContent: errors?.[name] ? "space-between" : "end",
          }}
        >
          {renderCharLimit()}
        </div>
      )}
    </div>
  );
};

InputField.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  displayType: PropTypes.oneOf(["outline", "underline"]),
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  errors: PropTypes.any,
  register: PropTypes.any,
  validationFn: PropTypes.func,
  onChangeFn: PropTypes.func,
  onBlurFn: PropTypes.func,
  placeholder: PropTypes.string,
  tooltipText: PropTypes.string,
  maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.string,
  accept: PropTypes.string,
  autoFocus: PropTypes.bool,
  requiredLabel: PropTypes.string,
  errorTextElipsis: PropTypes.bool,
  maxCharLimit: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  isShowCharacterLimit: PropTypes.bool,
  preventCharacters: PropTypes.array,
  helperText: PropTypes.string,
  hidePlaceHolder: PropTypes.bool,
  translateClass: PropTypes.any,
  labelTemplate: PropTypes.string,
  isShowLabel: PropTypes.bool,
  showError: PropTypes.bool,
};
InputField.defaultProps = {
  type: "text",
  displayType: "outline",
  placeholder: "",
  label: "",
  tooltipText: "",
  isRequired: false,
  maxLength: "",
  size: "lg",
  autoFocus: false,
  requiredLabel: "",
  errorTextElipsis: false,
  maxCharLimit: 0,
  isShowCharacterLimit: false,
  preventCharacters: [],
  helperText: "",
  hidePlaceHolder: false,
  labelTemplate: "default",
  isShowLabel: true,
  showError: true,
};
