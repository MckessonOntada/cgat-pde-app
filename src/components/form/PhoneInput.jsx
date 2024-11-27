import React from 'react';
import { MaskedInput, TextError, Label, Required } from '@mckesson/mcp-component-library'; 
import './Components.scss'
import { getNestedValue } from './util';

export default function PhoneInput(props) {
  const { field, form, label } = props;

  // Determine if the field has an error and is touched
  const errorMessage = getNestedValue(form.errors, field.name);
  const isFieldTouched = getNestedValue(form.touched, field.name);
  console.log('field.value', field.value);

  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
      const match = phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/);
      console.log('match', match)
      return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phoneNumber; 
    }
    return "";
  };
  //useeffect delay
  return (
    <div className='grid align-PhoneInput'>
      <Label htmlFor="phone_no" className="label-heading">
        {label}
        <Required id="Required">
          Required
        </Required>
      </Label>
      <MaskedInput
        {...props}
        id="phone_no"
        mask="(XXX) XXX-XXXX"
        onChangeFn={value => form.setFieldValue(field.name, value)}
        onBlurFn={() => form.setFieldTouched(field.name, true)}
        value={formatPhoneNumber(field.value)}
        dataTestId="mobile-input"
        useUnmaskedValue={false}
        className={`phoneInput ${form.errors[field.name] && form.touched[field.name] ? 'outline-error' : ''}`}
        errorMessage={form.errors[field.name] || ''}
      />
      {isFieldTouched && errorMessage && (
        <TextError errorMessage={errorMessage} />
      )}
    </div>
  );
}