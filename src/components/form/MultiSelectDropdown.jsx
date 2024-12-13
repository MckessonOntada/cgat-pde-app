import React, { useState } from 'react';
import { SearchableDropdown } from '../searchableDropdown';
import React from 'react';
import { Label, SearchableDropdown, Required } from '@mckesson/mcp-component-library';

const MultiSelectDropdown = (props) => {
  const { id, label, value, isRequired, onChange, onSearch, error, variant, options, recordsCountToEnableSearch, ...rest } = props;
  const [startSearchStringTimer, setStartSearchStringTimer] = useState(null);
  const [searchString, setSearchString] = useState('');

  const debouncedSearch = () => {
    clearTimeout(startSearchStringTimer);
    const timeout = setTimeout(() => onSearch(searchString), 500);
    setStartSearchStringTimer(timeout);
  };

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
    <div className="grid">
      <Label htmlFor={id} className="label-heading">
        {label}
        {isRequired && <Required id="Required">Required</Required>}
      </Label>
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
        {...rest}
      />
      {error && <TextError errorMessage={error} />}
    </div>
  );
};

export default MultiSelectDropdown;
