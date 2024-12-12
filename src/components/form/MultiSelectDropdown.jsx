import React from 'react';
import { Label, SearchableDropdown } from '@mckesson/mcp-component-library';

const MultiSelectDropdown = (props) => {
  const { id, label, value, isRequired, onChange, error, ...rest } = props;

  return (
    <div className="grid">
      <Label htmlFor={id} className="label-heading">
        {label}
        {isRequired && <Required id="Required">Required</Required>}
      </Label>
      <SearchableDropdown id={id} name={id} value={value} error={!!error} onChange={onChange} {...rest} />
      {error && <TextError errorMessage={error} />}
    </div>
  );
};

export default MultiSelectDropdown;
