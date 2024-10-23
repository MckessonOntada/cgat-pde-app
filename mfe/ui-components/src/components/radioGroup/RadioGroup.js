import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/RadioGroup.module.scss";
import { Dropdown } from "../dropdown/Dropdown";
import { CommonUtils } from "../../common/utils/CommonUtils";
import { ReactComponent as InfoIcon } from "../../assets/svg/info.svg";
import { Button } from "../button";
import { Legend } from "../legend";
import { Tooltip } from "../tooltip";
import { Required } from "../required";
import { Label } from "../label";
import {TextError } from "../textError";

export const RadioGroup = (props) => {
  let {
    id,
    items,
    onChangeValue,
    direction,
    caption,
    value,
    radioBtnWidth,
    showFlexWrap,
    otherTextValue,
    onOtherTextChange,
    onSubRadioFieldChange,
    dataSchema,
    masterListsMeta,
    isRequired,
    size,
    tooltipText,
    error,
    errorMessage,
    showClear,
    breakItemLabel,
    itemCustomStyles,
    labelCustomStyles,
  } = props;

  const onChangeRadio = (event, isOtherFieldChange) => {
    onChangeValue(event.target.value);
  };

  const getListOptions = (control) => {
    if (CommonUtils.isNonEmptyObject(masterListsMeta)) {
      return CommonUtils.isNonEmptyArray(masterListsMeta[control.dataSource])
        ? masterListsMeta[control.dataSource]
        : [];
    }
    return [];
  };

  return (
    <>
      <fieldset
        onChange={onChangeRadio}
        className={`${styles["direction-" + direction]} ${
          showFlexWrap && styles.flexWrapStyle
        }`}
        data-testid="radio-container"
      >
        <Legend
          fontSize={"var(--brand-font-size--small)"}
          className={styles.labelContainer}
          styles={labelCustomStyles}
        >
          {caption}
          {isRequired && <Required />}
          {tooltipText && (
            <Tooltip
              body={tooltipText}
              key={"input-tooltip-" + id}
              placement="top"
            >
              <span aria-label="information" className={styles.tooltipStyles}>
                <InfoIcon />
              </span>
            </Tooltip>
          )}
          {showClear && (
            <div className={`${styles.radioClearFieldButton}`}>
              <Button
                variant="tertiary"
                textButton={true}
                textTransform={"capitalize"}
                onClick={() => {
                  onChangeValue("");
                }}
              >
                <span style={{ fontSize: "12px" }}>clear</span>
              </Button>
            </div>
          )}
        </Legend>

        {items &&
          items.map((item, index) => {
            return (
              <div
                key={id + "-item-" + index}
                className={`${
                  size === "lg"
                    ? styles.largeRadioGroupWrapper
                    : size === "sm"
                    ? styles.smallRadioGroupWrapper
                    : styles.radioGroupWrapper
                }`}
              >
                <div
                  data-testid={id + "-item-" + index}
                  className={`${styles.radioWrapper} ${
                    item.isDisabled && styles.disabledDiv
                  } ${
                    item.value === value &&
                    item.isDisabled &&
                    styles.itemCheckedDisabled
                  } ${item.isError && styles.itemError} ${
                    item.value === value &&
                    item.isError &&
                    styles.itemCheckedError
                  } 
                 ${styles["radioBtnWidth-" + radioBtnWidth]} ${
                    !breakItemLabel ? styles.radioWrapperFlex : ""
                  }`}
                >
                  <input
                    type="radio"
                    id={id + "-item-" + index}
                    name={id + "-item"}
                    value={item.value}
                    disabled={item.isDisabled}
                    checked={item.value === value}
                    onChange={() => {}} // ignored as fieldset is handling the onChange, this is dummy event to suppress html error
                  />
                  <Label
                    htmlFor={id + "-item-" + index}
                    customStyles={itemCustomStyles}
                  >
                    {item.label}
                  </Label>
                </div>
                {item.isOther &&
                value.trim().toLowerCase() ===
                  item.value.trim().toLowerCase() ? (
                  <div className={styles.radioGroupCustomWrapper}>
                    <div className={styles.radioGroupCustomLabel}>
                      {item.otherLabel}
                    </div>
                    <input
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
                      className={styles.radioGroupOtherInput}
                    />
                  </div>
                ) : null}
                {item.isSubRadioField &&
                value.trim().toLowerCase() === item.value.trim().toLowerCase() //dataschema value === uischema value
                  ? item.subRadioFields.map((content, index) => {
                      return (
                        <div className={styles.dropdownSubField}>
                          <Dropdown
                            id={id + "-sub-radio-field-" + index}
                            name={content.fieldGroupId}
                            label={content.fieldLabel}
                            placeholder={content.placeholder}
                            isRequired={false}
                            options={
                              content.apiDriven
                                ? getListOptions(content)
                                : content.dataSource
                            }
                            value={
                              CommonUtils.isNonEmptyObject(content) &&
                              masterListsMeta[content.dataSource] &&
                              CommonUtils.isNonEmptyObject(dataSchema)
                                ? dataSchema[item.optionKey].value.text[
                                    content.fieldKey
                                  ].value
                                : ""
                            }
                            onChange={(e) =>
                              onSubRadioFieldChange(
                                e,
                                content.fieldGroupId,
                                content.fieldKey
                              )
                            }
                            isDisabled={false}
                            size="xs"
                          />
                        </div>
                      );
                    })
                  : null}
              </div>
            );
          })}
      </fieldset>
      {error && errorMessage && (
        <TextError errorMessage={errorMessage} showErrorIcon id={id} />
      )}
    </>
  );
};

RadioGroup.propTypes = {
  id: PropTypes.string.isRequired, // html id for radio group
  items: PropTypes.array.isRequired, //<{isDisabled:boolean,value:string,label:String}>[]
  value: PropTypes.string, // value is a string from given items
  onChangeValue: PropTypes.func, // for getting the selected item . it will accpt a callback function
  direction: PropTypes.string, // "row","column"
  caption: PropTypes.string, //heading
  showFlexWrap: PropTypes.bool,
  radioBtnWidth: PropTypes.string,
  otherTextValue: PropTypes.any,
  onOtherTextChange: PropTypes.func,
  onSubRadioFieldChange: PropTypes.func,
  masterListsMeta: PropTypes.any,
  dataSchema: PropTypes.any,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  showClear: PropTypes.bool,
  tooltipText: PropTypes.any,
};

RadioGroup.defaultProps = {
  direction: "row",
  otherTextValue: "",
  size: "md",
  showClear: false,
  breakItemLabel: true,
  tooltipText: "",
  labelCustomStyles: {},
  itemCustomStyles: {},
};
