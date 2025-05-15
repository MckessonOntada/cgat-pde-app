import React from 'react';
import {
  DateRangePicker,
  Dropdown,
  Button
} from '@mckesson/mcp-component-library';
import './FilterToolbar.scss';

const FilterToolbar = ({
  dateRange,
  setDateRange,
  dropdownValue,
  setDropdownValue,
  dropdownOptions,
  onApply,
  intl
}) => (
  <div className="filter-toolbar">
    <DateRangePicker
      id="notification-filter-date-range"
      dateRange={dateRange}
      onChange={setDateRange}
      size="lg"
    />
    <Dropdown
      id="notification-filter-dropdown"
      options={dropdownOptions}
      value={dropdownValue}
      onChange={setDropdownValue}
      size="lg"
    />
    <Button size="lg" variant="secondary" onClick={onApply}>
      {intl.formatMessage({ id: 'notifications.cta.apply' })}
    </Button>
  </div>
);

export default FilterToolbar;
