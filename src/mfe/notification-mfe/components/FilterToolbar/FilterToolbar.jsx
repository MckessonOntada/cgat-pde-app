import React from 'react';
import {
  DateRangePicker,
  Dropdown,
  Button
} from '@mckesson/mcp-component-library';
import './FilterToolbar.scss';
import { useTranslate } from '@src/translations/useTranslation';
import { useNotifications } from '../../context/NotificationsContext';

const FilterToolbar = ({ isMobileView }) => {
  const { t } = useTranslate();
  const elementSize = isMobileView ? 'sm' : 'md';
  const { dropdownOptions, filterState, setFilterState } = useNotifications();
  const [dropdownValue, setDropdownValue] = React.useState(
    filterState.notificationDropdownValue
  );

  const setDateRange = (dateRange) => {
    setFilterState((prevState) => ({
      ...prevState,
      notificationDateRange: dateRange
    }));
  };

  const onDropdownChange = (value) => {
    setFilterState((prevState) => ({
      ...prevState,
      notificationDropdownValue: value
    }));
  };

  const onApply = () => {
    setFilterState((prevState) => ({
      ...prevState,
      notificationDateRange: filterState.notificationDateRange,
      notificationDropdownValue: filterState.notificationDropdownValue
    }));
  };

  return (
    <div className="filter-toolbar">
      <DateRangePicker
        id="notification-filter-date-range"
        dateRange={filterState.notificationDateRange}
        onChange={setDateRange}
        size={elementSize}
      />
      <Dropdown
        id="notification-filter-dropdown"
        options={dropdownOptions}
        value={filterState.notificationDropdownValue}
        onChange={onDropdownChange}
        size={elementSize}
      />
      <Button size={elementSize} variant="secondary" onClick={onApply}>
        {t('notifications.cta.apply')}
      </Button>
    </div>
  );
};

export default FilterToolbar;
