import React from "react";
import PropTypes from "prop-types";
import styles from "./assets/CheckboxGroup.module.scss";
import { Legend } from "../legend";
import { Tooltip } from "../tooltip";
import { Required } from "../required";
import { Label } from "../label";
import {TextError } from "../textError";
import InfoIcon from "../../assets/svg/info.svg";

export const CheckboxGroup = (props) => {
  let {
    id,
    items,
    direction,
    caption,
    showFlexWrap,
    tooltipText,
    error,
    errorMessage,
    isRequired,
    rowGapPx,
    columnGapPx,
    itemCustomStyles,
    labelCustomStyles,
  } = props;

  const gapClass =
    direction === "column"
      ? rowGapPx && styles[`column-gap-${rowGapPx}`]
      : columnGapPx && styles[`row-gap-${columnGapPx}`];

  return (
    <>
      <fieldset
        data-testid="checkbox-container"
        className={`${styles["direction-" + direction]} ${
          gapClass ? gapClass : ""
        } ${showFlexWrap && styles.flexWrapStyle}`}
      >
        <Legend
          fontSize={"var(--brand-font-size--small)"}
          className={styles.captionWrap}
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
        </Legend>
        {items &&
          items.map((item, index) => {
            return (
              <div
                key={id + "-wrapitem-" + index}
                data-testid={id + "-wrapitem-" + index}
                className={`${styles.checkboxWrapper}`}
              >
                <input
                  className={
                    item.isChecked && item.isDisabled
                      ? styles.checkedDisable
                      : ""
                  }
                  type="checkbox"
                  id={id + "-labelitem-" + index}
                  name={id + "-labelitem-" + index}
                  disabled={!item.isChecked && item.isDisabled}
                  checked={item.isChecked}
                  onChange={item.onChange}
                />
                <Label
                  htmlFor={id + "-labelitem-" + index}
                  className={`${styles.checkbox} ${
                    item.isChecked && item.isDisabled ? styles.pointerEvent : ""
                  }`}
                  customStyles={itemCustomStyles}
                >
                  {item.label}
                </Label>
              </div>
            );
          })}
      </fieldset>
      {error && <TextError errorMessage={errorMessage} showErrorIcon />}
    </>
  );
};

CheckboxGroup.propTypes = {
  id: PropTypes.string.isRequired, // html id for radio group
  items: PropTypes.array.isRequired, //<{isDisabled:boolean,value:string,label:String}>[]
  direction: PropTypes.string, // "row","column"
  caption: PropTypes.string, //heading
  showFlexWrap: PropTypes.bool, // flexwrap design
};

CheckboxGroup.defaultProps = {
  direction: "column",
};
