import React from 'react';
import { Dropdown as BaseDropdown, Label, TextError } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './Components.scss'

export default function Dropdown(props) {
  const { t } = useTranslate();
  const { field, form, fieldlabel } = props;
  const error = form.errors[field.name] && form.touched[field.name];
  return (
    <div style={{ display: 'grid'}}>
      <Label htmlFor={field.name} className="label-heading">
        {fieldlabel}
        {props.isRequired ?
          <span className="requiredIcon">✱</span> : null}
      </Label>
      <BaseDropdown
        {...props}
        value={field.value}
        error={!!error}
        //errorMessage={error ? form.errors[field.name] : ''}
        onChange={value => {
          form.setFieldValue(field.name, value);
        }}
        size="lg" 
      />
      {form.errors[field.name] ? (
        <TextError errorMessage={form.errors[field.name]} />
      ) : (
        <div className="error-placeholder"></div>
      )}
    </div>
  );
}
