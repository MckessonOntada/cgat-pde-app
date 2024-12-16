import React, { useEffect, useMemo, useRef } from 'react';
import {
  InputField as BaseInputField,
  Label,
  TextError,
  Required
} from '@mckesson/mcp-component-library';
import './Components.scss';
import { getNestedValue } from './util';

export default function InputField(props) {
  const { field, form, children, className, label, maxLength, ...rest } = props;

  // Determine if the field has an error and is touched
  const errorMessage = getNestedValue(form?.errors, field?.name);
  const isFieldTouched = getNestedValue(form?.touched, field?.name);

  const inputDivRef = useRef(null);

  // To set the Value for field. There is no name Present in Input Component
  const handleOnChange = (event) => {
    if(typeof props.onChange === "function"){
      props.onChange(event);
    }

    form.setFieldValue(`${field.name}`, event.target.value);
  };
  const handleOnBlur = (event) => {
    form.setFieldTouched(`${field.name}`, true);
  };

  const { initialValues } = form;
  const fieldValue = useMemo(
    () => {
      return getNestedValue(initialValues, field.name)},
    [initialValues, field]
  );

  // To set initial value
  useEffect(() => {
    if (!!fieldValue && inputDivRef?.current) {
      // This is hack, need to replace
      inputDivRef.current.querySelectorAll('input')[0].value = fieldValue;
      form.setFieldValue(`${field.name}`, fieldValue);
    }
  }, [fieldValue]);

  return (
    <div className="grid" ref={inputDivRef}>
      <Label htmlFor={field.name} className="label-heading">
        {label}
        {props.isRequired && <Required id="Required">Required</Required>}
      </Label>
      <BaseInputField
        {...rest}
        id={field.name}
        name={field.name}
        register={() => ({
          onChange: handleOnChange,
          onBlur: handleOnBlur
        })}
        errors={form?.errors}
        showError={!form?.isValid}
        size="lg"
        maxLength={maxLength}
      />
      {isFieldTouched && errorMessage && <TextError errorMessage={errorMessage} />}
    </div>
  );
}
