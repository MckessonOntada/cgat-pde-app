import { Label, TextareaInput, TextError } from '@mckesson/mcp-component-library';
import React, { useRef } from 'react';
import { highlightFieldOnLabelClick } from './util';

export default function Textarea(props) {
  const {
    id,
    label,
    labelControls,
    value,
    error,
    isRequired,
    maxCharLimit = 1000,
    displayType = 'outline',
    onChange,
    onBlur,
    minRows,
    maxCharHelperText,
    ...rest
  } = props;
  const fieldContainerRef = useRef(null);

  return (
    <div className="grid" onClick={(e) => highlightFieldOnLabelClick(e, fieldContainerRef)} ref={fieldContainerRef}>
      <div className="row-space-between-center">
        <Label htmlFor={id} className="label-heading">
          {label}
          {isRequired && <span className="required"> *</span>}
        </Label>
        {labelControls}
      </div>
      <TextareaInput
        id={id}
        name={id}
        onChangeFn={onChange}
        onBlurFn={onBlur}
        showError={!!error}
        displayType={displayType}
        maxCharLimit={maxCharLimit}
        minRows={minRows}
        value={value}
        maxCharHelperText={maxCharHelperText}
        {...rest}
      />
      {error && (
        <div style={{ marginTop: maxCharHelperText ? '0px' : '-20px', display: 'inline-block' }}>
          <TextError errorMessage={error}></TextError>
        </div>
      )}
    </div>
  );
}
