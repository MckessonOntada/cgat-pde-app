import React from 'react';
import { MaskedInput, TextError, Label, Required } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './Components.scss'
import { getNestedValue } from './util';

export default function PhoneInput(props) {
  const { field, form ,label } = props;
  // Determine if the field has an error and is touched
  const errorMessage = getNestedValue(form.errors, field.name);
  const isFieldTouched = getNestedValue(form.touched, field.name);

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
        value={field.value}
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