import React from 'react';
import PropTypes from 'prop-types';
import styles from './assets/index.module.scss';
import { Label, Legend, Heading, CustomDatepicker } from '@mckesson/mcp-component-library';

export const PaymentOptionsControls = (props) => {
  let {
    id,
    items,
    onChangeValue,
    caption,
    value,
    radioBtnWidth,
    showFlexWrap,
    isRequired,
    size = 'md',
    breakItemLabel = true,
    itemCustomStyles = {},
    labelCustomStyles = {}
  } = props;

  const onChangeRadio = (event, isOtherFieldChange) => {
    onChangeValue(event.target.value);
  };

  return (
    <>
      <fieldset
        onChange={onChangeRadio}
        className={`${styles['direction-column']} ${showFlexWrap && styles.flexWrapStyle}`}
        data-testid="radio-container">
        <Legend fontSize={'var(--brand-font-size--small)'} className={styles.labelContainer} styles={labelCustomStyles}>
          {caption}
          {isRequired && <span className="required">*</span>}
        </Legend>

        {items &&
          items.map((item, index) => {
            return (
              <div
                key={id + '-item-' + index}
                className={`${
                  size === 'lg' ? styles.largeRadioGroupWrapper : size === 'sm' ? styles.smallRadioGroupWrapper : styles.radioGroupWrapper
                }`}>
                <div
                  data-testid={id + '-item-' + index}
                  className={`${styles.radioWrapper} ${item.isDisabled && styles.disabledDiv} ${
                    item.value === value && item.isDisabled && styles.itemCheckedDisabled
                  } ${item.isError && styles.itemError} ${item.value === value && item.isError && styles.itemCheckedError} 
                 ${styles['radioBtnWidth-' + radioBtnWidth]} ${!breakItemLabel ? styles.radioWrapperFlex : ''}`}>
                  <input
                    type="radio"
                    id={id + '-item-' + index}
                    name={id + '-item-' + index}
                    value={item.value}
                    disabled={item.isDisabled}
                    checked={item.value === value}
                    onChange={() => {}} // ignored as fieldset is handling the onChange, this is dummy event to suppress html error
                  />
                  <Label htmlFor={id + '-item-' + index} customStyles={itemCustomStyles}>
                    {item.label}
                  </Label>
                  <Heading as={'h6'} className={styles.subLabel}>
                    {item.subLabel}
                  </Heading>
                </div>
                {item?.subType === 'datePicker' && (
                  <div className={styles.datePickerSubField}>
                    <CustomDatepicker
                      id={id + '-sub-radio-field-' + index}
                      name={item.value}
                      value={''}
                      onChangeFn={(e) => item.onSubTypeChange(e)}
                      isDisabled={item.isDisabled || item.value !== value}
                      isShowLabel={false}
                    />
                  </div>
                )}
              </div>
            );
          })}
      </fieldset>
    </>
  );
};

PaymentOptionsControls.propTypes = {
  id: PropTypes.string.isRequired, // html id for radio group
  items: PropTypes.array.isRequired, //<{isDisabled:boolean,value:string,label:String}>[]
  value: PropTypes.string, // value is a string from given items
  onChangeValue: PropTypes.func, // for getting the selected item . it will accpt a callback function
  caption: PropTypes.string, //heading
  showFlexWrap: PropTypes.bool,
  radioBtnWidth: PropTypes.string,
  onOtherTextChange: PropTypes.func,
  onSubRadioFieldChange: PropTypes.func,
  dataSchema: PropTypes.any,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};
