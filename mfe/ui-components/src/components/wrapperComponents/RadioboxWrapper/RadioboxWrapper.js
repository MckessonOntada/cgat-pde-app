import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/RadioboxWrapper.module.scss";
import { CommonUtils } from "../../../common/utils";
import { Dropdown } from "../../dropdown";
import { Required } from "../../required";
import { Button } from "../../button";
import { Label } from "../../label";
import { Legend } from "../../legend";
import { TextError } from "../../textError";
import { CheckboxWrapper } from "../CheckboxWrapper";

export const RadioboxWrapper = (props) => {
  let {
    id,
    items,
    onChangeValue,
    direction,
    label,
    value,
    radioBtnWidth,
    showFlexWrap,
    otherTextValue,
    onOtherTextChange,
    onSubRadioFieldChange,
    dataSchema,
    masterListsMeta,
    isRequired,
    fieldStyle,
    className,
    renderClearButton,
    helperText,
    fieldClassName,
    handleClear,
    errorMessage,
    isReadOnly,
    translateClass = "",
    onCheckBoxChange,
    subFieldOptions,
    size,
    formErrorMessages
  } = props;

  const onChangeRadio = (event, isOtherFieldChange) => {
    if (event.target.type != "checkbox") {
      onChangeValue(event.target.value);
    }
  };

  const getListOptions = (control) => {
    if (CommonUtils.isNonEmptyObject(masterListsMeta)) {
      return CommonUtils.isNonEmptyArray(masterListsMeta[control.dataSource])
        ? masterListsMeta[control.dataSource]
        : [];
    }
    return [];
  };

  const createFullPostMarkup = () => {
    const text = `<style>${fieldStyle ?? ""}</style>${label["__html"]}`;
    return { __html: text };
  };

  const getAriaDescribedBy = () => {
    let describedBy = "";

    if (helperText) {
      describedBy += `radiogroup-helpertext-${id} `;
    }
    if (errorMessage) {
      describedBy += `${id}-error`;
    }
    return describedBy.trim();
  };

  const renderOtherField = (item, index) => {
    if (item.isOther && value?.trim().toLowerCase() === item.value?.trim().toLowerCase()) {
      return (
        <div className={styles.radioGroupCustomWrapper}>
          <style>{item.customOtherInputStyle}</style>
          {Boolean(item.otherLabel) && (
            <div className={styles.radioGroupCustomLabel}>
              {item.otherLabel}
              {item.required && <Required />}
            </div>
          )}
          <input
            aria-label={
              item.otherLabel ? item.otherLabel : item?.label
            }
            id={id + "-item-input-" + index}
            data-testid={id + "-item-input-" + index}
            placeholder={item.otherPlaceholder}
            type={item.otherType ? item.otherType : "text"}
            size="md"
            onInput={(e) => {
              item.otherType === "number"
                ? (e.target.value = e.target.value.slice(
                  0,
                  item.maxLength
                ))
                : {};
            }}
            maxLength={item.maxLength ? item.maxLength : "100"}
            value={otherTextValue}
            onChange={(e) => {
              onOtherTextChange(e.target.value, true);
              e.stopPropagation();
            }}
            className={`${styles.radioGroupOtherInput} ${item.customOtherInputClass
              ? item.customOtherInputClass
              : ""
              } ${formErrorMessages?.[
                item.otherLabelId ?? item.otherLabel
              ]?.message && styles.otherInputError
              } `}
          />
          {formErrorMessages?.[item.otherLabelId ?? item.otherLabel]
            ?.message && (
              <div
                className={`${styles.errorTextContainer} ${item.customOtherInputClass
                  ? item.customOtherInputClass
                  : ""
                  }`}
              >
                <TextError
                  errorMessage={
                    formErrorMessages?.[
                      item.otherLabelId ?? item.otherLabel
                    ]?.message
                  }
                  id={id}
                />
              </div>
            )}
        </div>
      )
    }
  }

  const renderSubRadioField = (item, index) => {
    if (item.isSubRadioField && value?.trim().toLowerCase() === item.value?.trim().toLowerCase()) {

      let subRadioFields = [];
      if (CommonUtils.isNonEmptyObject(dataSchema)) {
        if (dataSchema[item.optionKey].value.text[item.fieldOtherKey].value === item.subRadioFieldAttribute.comparisonValue) {
          subRadioFields = item.subRadioFields;
        } else {
          subRadioFields = [
            ...item.subRadioFields.slice(
              item.subRadioFieldAttribute.sliceStart,
              item.subRadioFieldAttribute.sliceEnd
            ),
          ]
        }
      } else {
        subRadioFields = item.subRadioFields;
      }

      if (CommonUtils.isNonEmptyArray(subRadioFields)) {

        return item.subRadioFields.map((content, index) => {
          let optionsLocal = [];
          let valueLocal = "";
          switch (content.fieldType) {
            case "SELECT_INPUT":
              if (content.apiDriven) {
                optionsLocal = getListOptions(content)
              } else {
                optionsLocal = content.dataSource
              }
              if (CommonUtils.isNonEmptyObject(dataSchema)) {
                if (masterListsMeta[content.dataSource] && CommonUtils.isNonEmptyObject(dataSchema)) {
                  valueLocal = dataSchema[item.optionKey].value.text[content.fieldKey].value;
                }
              } else if (content.value) {
                valueLocal = content.value;
              }
              return (
                <div className={styles.dropdownSubField}>
                  <Dropdown
                    id={id + "-sub-radio-field-" + index}
                    name={content.fieldGroupId}
                    label={content.fieldLabel}
                    placeholder={content.placeholder}
                    isRequired={false}
                    options={optionsLocal}
                    value={valueLocal}
                    onChange={(e) => {
                      onSubRadioFieldChange(
                        e,
                        content.fieldGroupId,
                        content.fieldKey,
                        content
                      );
                    }}
                    isDisabled={false}
                    size="xs"
                    helperText={helperText}
                    labelTemplate={content.labelVarient}
                  />
                </div>
              );
            case "TEXT_INPUT":
              if (CommonUtils.isNonEmptyObject(dataSchema)) {
                valueLocal = dataSchema[item.optionKey].value.text[content.fieldKey].value
              } else if (content.value) {
                valueLocal = content.value;
              }
              return (
                <div className={styles.dropdownSubField}>
                  <div className={styles.radioGroupCustomLabel}>
                    {content.label}
                  </div>
                  <input
                    aria-label={content.label}
                    id={id + "-item-input-" + index}
                    data-testid={id + "-item-input-" + index}
                    placeholder={content.placeholder}
                    type={
                      content.otherType
                        ? content.otherType
                        : "text"
                    }
                    size="md"
                    onInput={(e) => {
                      content.otherType === "number"
                        ? (e.target.value = e.target.value.slice(
                          0,
                          content.maxLength
                        ))
                        : {};
                    }}
                    maxLength={
                      content.maxLength
                        ? content.maxLength
                        : "100"
                    }
                    value={valueLocal}
                    onChange={(e) => {
                      onSubRadioFieldChange(
                        e.target.value,
                        content.fieldGroupId,
                        content.fieldKey,
                        content
                      );
                      e.stopPropagation();
                    }}
                    className={styles.radioGroupOtherInput}
                  />
                </div>
              );
            default:
              <></>;
          }
        })
      }
    }
  }

  const renderDynamicSubRadioField = (item, index) => {
    if (item.isDynamicSubRadioFields && value.trim().toLowerCase() === item.value.trim().toLowerCase()) {
      if (item.subRadioFieldType == "CHECKBOX_INPUT") {
        let subFieldOptionsLocal = subFieldOptions.map((option, optionIndex) => ({
          ...option,
          value: option.value,
          label: option.label,
          onChange: () => {
            onCheckBoxChange(option, optionIndex, index);
          },
        }));
        return (
          <div className={styles.checkBoxSubfieldWrapper}>
            <CheckboxWrapper
              isSubField={true}
              items={subFieldOptionsLocal}
            />
          </div>
        )
      }
    }
  }

  return (
    <>
      <fieldset
        onChange={onChangeRadio}
        className={`${styles["direction-" + direction]} ${styles.fieldsetInlineSize
          }`}
        data-testid={'header-' + id}
      >
        {Boolean(label?.__html) ? (
          <div>
            <Legend
              data-testid={'header-sub-' + id}
              className={styles.newRbgHeader}
              fontWeight={"var(--brand-font-weight-600)"}
              fontSize={"var(--brand-font-size--default)"}
              dangerouslySetInnerHTML={createFullPostMarkup()}
            ></Legend>
          </div>
        ) : (
          <Legend
            data-testid={'header-sub-' + id}
            fontWeight={
              size == "sm"
                ? "var(--brand-font-weight-400)"
                : "var(--brand-font-weight-600)"
            }
            fontSize={
              helperText
                ? "var(--brand-font-size--small)"
                : size == "sm"
                  ? "var(--brand-font-size--extra-small)"
                  : "var(--brand-font-size--default)"
            }
            className={`${helperText ? styles.parentHeader : styles.newRbgHeader
              }`}
          >
            <span>
              {label}
              {isRequired && <Required />}
            </span>
          </Legend>
        )}
        {helperText && (
          <p
            className={styles.helperTextLabel}
            id={"radiogroup-helpertext-" + id}
            data-testid={"radiogroup-helpertext-" + id}
          >
            <span>{helperText}</span>
          </p>
        )}
        <div
          className={`${styles.rbgOptionsContainer} ${className} ${styles["direction-" + direction]
            } ${showFlexWrap && styles.flexWrapStyle}`}
        >
          <style>{fieldStyle}</style>

          {items &&
            items.map((item, index) => {
              return (
                <div
                  key={id + "-item-" + index}
                  data-testid={"radiogroup-option-" + index}
                  className={styles.radioGroupWrapper}
                >
                  <div
                    data-testid={id + "-item-" + index}
                    className={`${styles.radioWrapper} ${(isReadOnly || item.isDisabled) && styles.disabledDiv
                      }  ${styles["radioBtnWidth-" + radioBtnWidth]}
                  ${item.value === value &&
                      (isReadOnly || item.isDisabled) &&
                      styles.itemCheckedDisabled
                      } 
                  `}
                  >
                    <input
                      type="radio"
                      id={id + "-item-" + index}
                      name={id + "-item"}
                      value={item.value}
                      disabled={isReadOnly || item.isDisabled}
                      checked={item.value === value}
                      onChange={() => { }} // ignored as fieldset is handling the onChange, this is dummy event to suppress html error
                    />
                    <Label
                      className={styles.radioLabel}
                      htmlFor={id + "-item-" + index}
                    >
                      {item.label}
                    </Label>
                  </div>
                  {renderOtherField(item, index)}
                  {renderSubRadioField(item, index)}
                  {renderDynamicSubRadioField(item, index)}
                </div>
              );
            })}
        </div>
        {renderClearButton && (
          <Button
            variant="tertiary"
            textButton={true}
            textTransform="Capatalize"
            size={"lg"}
            onClick={() => {
              handleClear(value);
            }}
            className={`${styles.clearButton} ${translateClass?.clearButton} ${fieldClassName}`}
            aria-describedby={getAriaDescribedBy()}
            disabled={isReadOnly}
          >
            Clear Selection
          </Button>
        )}
      </fieldset>
      {errorMessage && (
        <TextError
          errorMessage={errorMessage}
          id={id}
          style={{ marginTop: "16px" }}
        />
      )}
    </>
  );
};

RadioboxWrapper.propTypes = {
  id: PropTypes.string.isRequired, // html id for radio group
  items: PropTypes.array.isRequired, //<{isDisabled:boolean,value:string,label:String}>[]
  value: PropTypes.string, // value is a string from given items
  onChangeValue: PropTypes.func, // for getting the selected item . it will accpt a callback function
  direction: PropTypes.string, // "row","column"
  label: PropTypes.string, //heading
  showFlexWrap: PropTypes.bool,
  radioBtnWidth: PropTypes.string,
  otherTextValue: PropTypes.any,
  onOtherTextChange: PropTypes.func,
  onSubRadioFieldChange: PropTypes.func,
  masterListsMeta: PropTypes.any,
  dataSchema: PropTypes.any,
  className: PropTypes.any,
  fieldStyle: PropTypes.any,
  renderClearButton: PropTypes.any,
  helperText: PropTypes.any,
  fieldClassName: PropTypes.any,
  errorMessage: PropTypes.string,
  isReadOnly: PropTypes.any,
  formErrorMessages: PropTypes.any,
};

RadioboxWrapper.defaultProps = {
  direction: "column",
  otherTextValue: "",
};
