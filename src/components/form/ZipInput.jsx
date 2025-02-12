import React, { useState, useEffect, useMemo, useRef } from 'react';
import { InputField as BaseInputField, Label, TextError, Required } from '@mckesson/mcp-component-library';
import { getNestedValue, highlightFieldOnLabelClick } from './util';

export default function ZipInput(props) {
  const { field, form, children, className, label, maxLength, ...rest } = props;

  // Determine if the field has an error and is touched
  const errorMessage = getNestedValue(form.errors, field.name);
  const isFieldTouched = getNestedValue(form.touched, field.name);
  const [maskedValue, setMaskedValue] = useState('');
  const zipinputDivRef = useRef(null);

  useEffect(() => {
    if (field.value) {
      setMaskedValue(generateMaskedValue(field.value));
    }
  }, [field.value]);

  const generateMaskedValue = (value) => {
    const unMaskedValue = value?.replace(/\D/g, '');
    if (unMaskedValue.length > 9) return maskedValue;
    if (unMaskedValue.length <= 5) return unMaskedValue;
    return `${unMaskedValue.slice(0, 5)}-${unMaskedValue.slice(5)}`;
  };

  const handleInputChange = (event) => {
    const rawValue = event.target.value.replace(/\D/g, '');
    const formattedValue = generateMaskedValue(rawValue);
    setMaskedValue(formattedValue);
    form.setFieldValue(`${field.name}`, formattedValue);
    zipinputDivRef.current.querySelectorAll('input')[0].value = formattedValue;
  };

  const handleInputBlur = () => {
    form.setFieldTouched(field.name, true);
  };
  const { initialValues } = form;
  const fieldValue = useMemo(() => getNestedValue(initialValues, field.name), [initialValues, field]);

  // To set initial value
  useEffect(() => {
    if (!!fieldValue && zipinputDivRef?.current) {
      // This is hack, need to replace
      zipinputDivRef.current.querySelectorAll('input')[0].value = fieldValue;
      form.setFieldValue(`${field.name}`, fieldValue);
    }
  }, [fieldValue]);
  return (
    <div className="grid align-ZipCodeInput" onClick={(e) => highlightFieldOnLabelClick(e, zipinputDivRef)} ref={zipinputDivRef}>
      <Label htmlFor={field.name} className="label-heading">
        {label}
        {props.isRequired && <span className='required'> *</span>}
      </Label>
      <BaseInputField
        {...rest}
        id={field.name}
        name={field.name}
        value={maskedValue}
        errors={{ [field.name]: errorMessage }}
        register={() => ({
          onChange: handleInputChange,
          onBlur: handleInputBlur
        })}
      />
      {isFieldTouched && errorMessage && <TextError errorMessage={errorMessage} />}
    </div>
  );
}
