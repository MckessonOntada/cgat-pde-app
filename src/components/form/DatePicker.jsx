import React, { useRef } from 'react';
import { CustomDatepicker, Label, Required, TextError } from '@mckesson/mcp-component-library';

export default function DatePicker({ id = '', value = '', label, error, onChange, isShowLabel = false, isRequired, ...props }) {
  const fieldContainerRef = useRef(null);
  return (
    <div id={id} className="grid" onClick={(e) => highlightFieldOnLabelClick(e, phoneInputRef)} ref={fieldContainerRef}>
      <Label htmlFor={id} className="label-heading">
        {label}
        {isRequired && <Required id="Required">Required</Required>}
      </Label>
      <CustomDatepicker
        id={id}
        name={id}
        value={value}
        onChangeFn={onChange}
        size="lg"
        isShowLabel={isShowLabel}
        showRequiredIcon={isRequired}
        {...props}
      />
      {error && <TextError errorMessage={error} />}
    </div>
  );
}
