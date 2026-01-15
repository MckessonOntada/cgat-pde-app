import React, { useRef } from 'react';
import { CustomDatepicker, Label, TextError, Tooltip } from '@mckesson/mcp-component-library';
import { getNestedValue } from './util';
import { ReactComponent as IconInfo } from '@src/assets/svg/info-2.svg';
export default function DatePicker(props) {
  const { id = '', value = '', label, error, onChange, infoText, isShowLabel = false, isRequired, form, field, ...rest } = props;

  const handleInputBlur = () => {
    form.setFieldTouched(field.name, true);
  };
  const isFieldTouched = getNestedValue(form.touched, field.name);
  const errorMessage = getNestedValue(form.errors, field.name);
  return (
    <div id={id} className="grid">
      <Label htmlFor={id} className="label-heading">
        {label}
        {isRequired && <span className="required"> *</span>}
        {infoText && (
          <span className="info-icon">
            <Tooltip body={infoText} placement="top">
              <div type="button" aria-label="information">
                <IconInfo />
              </div>
            </Tooltip>
          </span>
        )}
      </Label>
      <CustomDatepicker
        id={id}
        name={id}
        value={value}
        onChangeFn={(e) => {
          handleInputBlur();
          onChange(e);
        }}
        size="lg"
        errors={isFieldTouched && errorMessage}
        onBlur={handleInputBlur}
        isShowLabel={isShowLabel}
        showRequiredIcon={isRequired}
        isInvalid={isFieldTouched && errorMessage}
        clearDate={true}
        {...rest}
      />
      {isFieldTouched && errorMessage && <TextError errorMessage={errorMessage} />}
    </div>
  );
}
