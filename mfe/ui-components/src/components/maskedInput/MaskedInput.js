import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

export const MaskedInput = (props) => {
  const {
    mask,
    id,
    name,
    label,
    className,
    onChangeFn,
    onBlurFn,
    placeholder,
    disabled,
    readOnly,
    autocomplete,
    value,
    useUnmaskedValue,
    ariaRequired,
    ariaDescribedby,
    ariaInvalid,
    dataTestId,
  } = props;
  const [maskedValue, setMaskedValue] = useState("");
  const [lastInputValueLength, setInputValueLength] = useState(0);

  useEffect(() => {
    if (!useUnmaskedValue && value) {
      generateMaskedValue(value);
    }
  }, []);

  const generateMaskedValue = (value) => {
    let unMaskedValue = value?.replace(/[\/\-\(\)\s]/g, "");
    if (!mask || !unMaskedValue) {
      setMaskedValue("");
      return "";
    }
    let maskedValue = "";
    let valueIndex = 0;
    let precedingSymbol = null;
    for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
      const maskChar = mask[maskIndex];
      if (maskChar === "X") {
        if (unMaskedValue[valueIndex]) {
          if (precedingSymbol) {
            maskedValue += precedingSymbol;
            precedingSymbol = null;
          }
          maskedValue += unMaskedValue[valueIndex];
          valueIndex += 1;
        } else {
          break;
        }
      } else {
        maskedValue += maskChar;
      }
    }
    /**
     * remove any trailing special characters from final masked value when editing
     * only when current input length is less than previous input lenth (or)
     * special character is the only char in string
     */
    const regex = /^[\/\-\(\)\s]$/;
    if (maskedValue.length < lastInputValueLength || maskedValue.length == 1) {
      let maskedValueLength = maskedValue.length;
      while (maskedValue[maskedValueLength - 1]) {
        if (maskedValue[maskedValue.length - 1].match(regex)) {
          maskedValue = maskedValue.slice(0, -1);
        } else {
          break;
        }
        maskedValueLength--;
      }
    }
    setInputValueLength(maskedValue.length);
    setMaskedValue(maskedValue);
    return maskedValue;
  };

  const onChangeValue = (event) => {
    if (event.target?.value) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
    }
    let maskedValue = generateMaskedValue(event.target.value);
    onChangeFn(
      useUnmaskedValue ? maskedValue : maskedValue.replace(/[\/\-\(\)\s]/g, "")
    );
  };

  return (
    <>
      {label && <p style={{ fontSize: "12px", padding: "2px" }}>{label}</p>}
      <input
        id={id}
        name={name}
        className={className}
        value={useUnmaskedValue ? value : maskedValue}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={autocomplete}
        onChange={(e) => {
          onChangeValue(e);
        }}
        onBlur={(event) => onBlurFn(event.target.value)}
        aria-required={ariaRequired}
        aria-describedby={ariaDescribedby}
        aria-invalid={ariaInvalid}
        data-testid={dataTestId}
      />
    </>
  );
};

MaskedInput.propTypes = {
  mask: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
  name: PropTypes.string,
  onChangeFn: PropTypes.func,
  onBlurFn: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  autocomplete: PropTypes.string,
  value: PropTypes.string,
  useUnmaskedValue: PropTypes.bool,
  ariaRequired: PropTypes.bool,
  ariaDescribedby: PropTypes.string,
  ariaInvalid: PropTypes.bool,
  dataTestId: PropTypes.any,
};

MaskedInput.defaultProps = {
  ariaInvalid: false,
};
