import React, { useRef } from 'react';
import { Dropdown as BaseDropdown, Label, TextError } from '@mckesson/mcp-component-library';
import './Components.scss';
import { highlightFieldOnLabelClick } from './util';

export default function Dropdown(props) {
  const { id, label, value = '', isRequired, error, onChange, ...rest } = props;
  const fieldContainerRef = useRef(null);

  return (
    <div id={id} onClick={(e) => highlightFieldOnLabelClick(e, fieldContainerRef)} ref={fieldContainerRef}>
      <Label htmlFor={id} className="label-heading">
        {label}
        {isRequired && <span className='required'> *</span>}
      </Label>
      <BaseDropdown value={value} error={!!error} onChange={onChange} {...rest} />
      {error && <TextError errorMessage={error} />}
    </div>
  );
}
