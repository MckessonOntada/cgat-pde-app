import React, { useEffect, useRef, useState } from 'react';
import { SearchableDropdown } from '../searchableDropdown';
import { Label, TextError } from '@mckesson/mcp-component-library';
import { highlightFieldOnLabelClick } from './util';

const MultiSelectDropdown = (props) => {
  const {
    id,
    label,
    value,
    isRequired,
    onChange,
    onSearch,
    error,
    variant,
    options,
    recordsCountToEnableSearch,
    forcedValue,
    placeholder,
    ...rest
  } = props;
  const [startSearchStringTimer, setStartSearchStringTimer] = useState(null);
  const [searchString, setSearchString] = useState('');

  const dropdownContainerRef = useRef(null);

  const debouncedSearch = () => {
    clearTimeout(startSearchStringTimer);
    const timeout = setTimeout(() => onSearch(searchString), 500);
    setStartSearchStringTimer(timeout);
  };

  useEffect(() => {
    if (!forcedValue) {
      return;
    }
    const inputElement = dropdownContainerRef.current.querySelector(`#label-${id}`);
    setTimeout(() => {
      inputElement.value = forcedValue;
      inputElement.innerText = options.find((opt) => opt.value === forcedValue).label;
    }, 100);
  }, [forcedValue]);

  React.useEffect(() => {
    if (variant !== 'async') {
      return;
    }

    debouncedSearch();
    return () => {
      clearTimeout(startSearchStringTimer);
    };
  }, [searchString]);

  return (
    <div ref={dropdownContainerRef} className="dropdown-container">
      {(label || isRequired) && (
        <div className="dropdown-label">
          <Label htmlFor={id} className="label-heading">
            {label}
            {isRequired && <span className="required"> *</span>}
          </Label>
        </div>
      )}
      <SearchableDropdown
        id={id}
        name={id}
        value={value}
        error={!!error}
        options={options}
        onChange={onChange}
        asyncHandleSearch={(e) => setSearchString(e)}
        asyncRecordsFound={options?.length}
        variant={variant}
        recordsCountToEnableSearch={recordsCountToEnableSearch}
        searchPlaceholder={placeholder}
        {...rest}
      />
      {error && <TextError errorMessage={error} />}
    </div>
  );
};

export default MultiSelectDropdown;
