import { useTranslate } from '@src/translations/useTranslation';
import React, { useEffect, useState } from 'react';
import { US_STATES } from './util';
import MultiSelectDropdown from './MultiSelectDropdown';
import { Label } from '@mckesson/mcp-component-library';

function StateDropdown({ field, form, label = 'State', isRequired = false }) {
  const { t } = useTranslate();
  const [selectedState, setSelectedState] = useState(null);
  const [searchKey, setSearchKey] = useState();
  const [options, setOptions] = useState(US_STATES());
  const [StatesList, setStatesList] = useState(US_STATES());

  const onStateChangeHandler = (event) => {
    form.setFieldValue(field.name, event || '');
  };

  const searchStates = (event) => {
    if (event) {
      setOptions(StatesList.filter((ele) => ele.label.toLowerCase().includes(event.toLowerCase())));
    } else {
      setOptions(StatesList);
    }
  };

  return (
    <React.Fragment>
      <div>
        {(label || isRequired) && (
          <div className="dropdown-label">
            <Label htmlFor={''} className="label-heading">
              {label}
              {isRequired && <span className="required"> *</span>}
            </Label>
          </div>
        )}
        <MultiSelectDropdown
          id={'select-state-search'}
          isMultiSelect={false}
          placeholder={'Search state'}
          onChange={onStateChangeHandler}
          options={options}
          variant={'async'}
          onSearch={(event) => searchStates(event)}
          recordsCountToEnableSearch={5}
          size="lg"
          isSortEnable={false}
          value={field.value || ''}
          fieldDisplayValue={options.find((opt) => opt.value === field.value) || undefined}
        />
      </div>
    </React.Fragment>
  );
}
export default StateDropdown;
