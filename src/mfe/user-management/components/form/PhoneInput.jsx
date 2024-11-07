import React from 'react';
import { MaskedInput, TextError, Label } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './Components.scss'

export default function PhoneInput(props) {
  const { field, form ,label } = props;
  const { t } = useTranslate();
  return (
    <div style={{ display: 'grid'}}>
      <Label htmlFor="phone_no" className="label-heading">
        {label}
        <span className="requiredIcon">✱</span>
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
      />
      {form.errors[field.name] ?  (
        <TextError errorMessage={form.errors[field.name]} id={field.name} />
      )  : (
        <div className="error-placeholder"></div>
      )}
    </div>
  );
}