import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/CheckboxWrapper.module.scss";
import { CommonUtils } from "../../../common/utils";
import { Required } from "../../required";
import { Label } from "../../label";
import { Legend } from "../../legend";
import { Button } from "../../button";
import { TextError } from "../../textError";

export const CheckboxWrapper = (props) => {
  let {
    id,
    items,
    direction,
    caption,
    showFlexWrap,
    onOtherTextChange,
    onOtherTextBlur,
    label,
    isRequired,
    fieldStyle,
    className,
    helperText,
    clearButtonPresent,
    clearField,
    errorMessage,
    translateClass,
    fieldGap,
    isOtherFieldError,
    isSubField,
    size,
    customOptionLableStyle,
    customOptionInputStyle,
    customOtherInputStyle
  } = props;

  const createFullPostMarkup = () => {
    // const text = label["__html"];
    const text = `<style>${fieldStyle ?? ""}</style>${label["__html"]}`;
    return { __html: text };
  };

  const getAriaDescribedBy = () => {
    let describedBy = "";
    if (helperText) {
      describedBy += `checkbox-helpertext-${id} `;
    }
    if (errorMessage) {
      describedBy += `${id}-error`;
    }
    return describedBy.trim();
  };

  const getOptionLabelSize = () => {
    if (size === 'sm') {
      return styles.checkboxLabelsm;
    }
    if (size === 'md') {
      return styles.checkboxLabelmd;
    }
    return styles.checkboxLabellg;
  }

  const getOptionInputSize = () => {
    if (size === 'sm') {
      return styles.optionInputsm;
    }
    if (size === 'md') {
      return styles.optionInputmd;
    }
    return styles.optionInputlg;
  }

  return (
    <>
      <fieldset
        className={`${styles.checkboxContainer} ${styles["direction-" + direction]} ${showFlexWrap && styles.flexWrapStyle
          }`}
      >
        {Boolean(label?.__html) ? (
          <Legend
            className={`${styles.newHeader} ${CommonUtils.isNonEmptyString(className) && className
              }${translateClass?.label}`}
            dangerouslySetInnerHTML={createFullPostMarkup()}
          >
            {/* <style>{fieldStyle ?? ""}</style> */}
          </Legend>
        ) : (
          <>
            <Legend
              className={`${styles.newHeader} ${CommonUtils.isNonEmptyString(className) && className
                } ${(!CommonUtils.isNonEmptyString(label) || helperText) &&
                styles.pb0
                } ${translateClass?.label} ${fieldGap && fieldGap.gapTop == false ? styles.pt0 : ""
                }`}
            >
              <style>{fieldStyle ?? ""}</style>
              <span>{label}</span>
              {isRequired && <Required />}
            </Legend>
            {helperText && (
              <p
                className={`${styles.helperTextHeader} ${translateClass?.helperText}`}
                id={"checkbox-helperText-" + id}
              >
                <span>{helperText}</span>
              </p>
            )}
          </>
        )}
        {items &&
          items.map((item, index) => {
            return (
              <div key={id + "-wrapitem-" + index}>
                {/* Adding line in case of isMaster key is true */}
                {item.isNone ? (
                  <div className={styles.checkBoxGroupNALabel}></div>
                ) : null}
                <div
                  data-testid={id + "-wrapitem-" + index}
                  className={`${styles.checkboxWrapper} ${isSubField && index < items.length - 1 ? styles.checkboxSubFieldWrapper : ""
                    }`}
                >
                  <input
                    type="checkbox"
                    id={id + "-labelitem-" + index}
                    name={id + "-labelitem-" + index}
                    disabled={item.isDisabled}
                    checked={item.isChecked}
                    onChange={item.onChange}
                    className={`${styles.newCheckBox} ${getOptionInputSize()} ${customOptionInputStyle ? customOptionInputStyle : ""}`}
                  />
                  <Label
                    htmlFor={id + "-labelitem-" + index}
                    className={`${styles.checkboxLabel} ${getOptionLabelSize()} ${customOptionLableStyle ? customOptionLableStyle : ""} ${translateClass?.options}`}
                  >
                    {item.label}
                    {item?.required && <Required />}
                  </Label>
                </div>
                {item.isOther && (item.openBeforeChecked || item.isChecked) ? (
                  <div className={`${styles.checkBoxGroupOtherInputContainer} ${customOtherInputStyle ? customOtherInputStyle : ""}`}>
                    {item.inputLabel && (
                      <Label
                        fontSize={"var(--brand-font-size--extra-small)"}
                        fontWeight={"-brand-font-weight-600"}
                        className={`${translateClass?.isOther}`}
                      >
                        {item.inputLabel}
                        {item?.isOtherFieldRequired && <Required />}
                      </Label>
                    )}
                    <div
                      className={
                        item.postText
                          ? styles.checkBoxGroupOtherInputWrapperGrid
                          : styles.checkBoxGroupOtherInputWrapper
                      }
                    >
                      <style>{item.customControlStyle ?? ""}</style>
                      <input
                        aria-label={item.label}
                        id={id + "-item-input-" + index}
                        style={{
                          height: item.postText ? "26px" : "auto",
                        }}
                        required={item.required}
                        data-testid={id + "-item-input-" + index}
                        placeholder={item?.optionAttribute?.placeholder ? item?.optionAttribute?.placeholder : ""}
                        value={item.isChecked ? item.otherValue : ""}
                        maxLength={
                          item.otherMaxLength ? item.otherMaxLength : 50
                        }
                        onChange={(e) => {
                          item.phoneNumberField &&
                            (e.target.value = CommonUtils.formattedPhoneNumber(
                              e.target.value
                            ));

                          onOtherTextChange(e.target.value, true, item);
                          e.stopPropagation();
                        }}
                        onBlur={(e) => {
                          onOtherTextBlur(e.target.value, item);
                        }}
                        className={`${styles.checkBoxGroupOtherInput} ${item.customControlClass ?? ""
                          }  ${translateClass?.postText}
                        ${errorMessage
                            && (errorMessage?.[item.optionKey] || isOtherFieldError)
                            && item.isOther
                            ? styles.errorOutline
                            : ""
                          }`}
                        disabled={!item.isChecked}
                        type={
                          item?.optionAttribute?.type == "number"
                            ? "number"
                            : "text"
                        }
                        {...(item?.optionAttribute?.type === "number" && {
                          min: item?.optionAttribute?.min,
                          max: item?.optionAttribute?.max,
                        })}
                        onInput={(e) => {
                          item?.optionAttribute?.type === "number"
                            ? (e.target.value = e.target.value.slice(
                              0,
                              item?.optionAttribute?.maxLength
                            ))
                            : {};
                        }}
                      />
                      {errorMessage
                        && (errorMessage?.[item.optionKey] || isOtherFieldError)
                        && item.isOther && (
                          <div className={styles.errorText}>
                            <TextError
                              errorMessage={isOtherFieldError ? errorMessage : errorMessage?.[item.optionKey]}
                              id={id}
                              style={{ marginTop: "16px" }}
                            />
                          </div>
                        )}
                      {item.postText ? (
                        <Label
                          fontWeight={"var(--brand-font-weight-600)"}
                          fontSize={"--brand-font-size--small"}
                        >
                          {item.postText}
                        </Label>
                      ) : null}
                      {item?.optionAttribute?.required && (
                        <Required className={styles.isOther} />
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
      </fieldset>
      {clearButtonPresent && (
        <Button
          variant="tertiary"
          textButton={true}
          textTransform="Capatalize"
          dataTestId="clear-selection"
          size={"lg"}
          onClick={() => {
            clearField();
          }}
          className={`${styles.clearButton} ${translateClass?.clearButton}`}
          aria-describedby={getAriaDescribedBy()}
        >
          Clear Selection
        </Button>
      )}
      {CommonUtils.isNonEmptyString(errorMessage) && !isOtherFieldError && (
        <div className={styles.errorText}>
          <TextError
            errorMessage={errorMessage}
            id={id}
            style={{ marginTop: "16px" }}
          />
        </div>
      )}
    </>
  );
};

CheckboxWrapper.propTypes = {
  id: PropTypes.string.isRequired, // html id for radio group
  items: PropTypes.array.isRequired, //<{isDisabled:boolean,value:string,label:String}>[]
  direction: PropTypes.string, // "row","column"
  caption: PropTypes.string, //heading
  showFlexWrap: PropTypes.boolean, // flexwrap design
  onOtherTextChange: PropTypes.func,
  label: PropTypes.any, //heading
  isRequired: PropTypes.boolean, //heading
  helperText: PropTypes.string,
  clearButtonPresent: PropTypes.bool,
  clearField: PropTypes.func,
  errorMessage: PropTypes.string,
  customOptionLableStyle: PropTypes.string,
  customOptionInputStyle: PropTypes.string,
  customOtherInputStyle: PropTypes.string,
  size: PropTypes.oneOf(["lg", "md", "sm"])
};

CheckboxWrapper.defaultProps = {
  direction: "column",
  size: "lg"
};