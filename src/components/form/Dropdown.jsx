import React from 'react';
import { Dropdown as BaseDropdown, Label, TextError, Required } from '@mckesson/mcp-component-library';
import './Components.scss';

export default function Dropdown(props) {
  const { id, label, value = '', isRequired, error, onChange, ...rest } = props;

  return (
    <div id={id} className="grid">
      <Label htmlFor={id} className="label-heading">
        {label}
        {isRequired && <Required id="Required">Required</Required>}
      </Label>
      <BaseDropdown value={value} error={!!error} onChange={onChange} {...rest} />
      {error && <TextError errorMessage={error} />}
    </div>
  );
}
