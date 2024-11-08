import React from 'react';
import { MaskedInput, TextError, Label, Required } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './Components.scss'

export default function PhoneInput(props) {
  const { field, form ,label } = props;
  const { t } = useTranslate();
  return (
    <div className='grid'>
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
      />
      {form.errors[field.name] && form.touched[field.name]  &&   (
        <TextError errorMessage={form.errors[field.name]} id={field.name}/>
      )   
      }
     {(form.errors[field.name] && !form.touched[field.name]) || !form.errors[field.name] ? (
  <TextError className="error-placeholder" />
) : null}
    </div>
  );
}