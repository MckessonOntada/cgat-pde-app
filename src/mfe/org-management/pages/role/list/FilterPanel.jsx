import { Button, DateRangePicker, SearchableDropdown, InputField } from '@mckesson/mcp-component-library';
import arrow_down from '@src/assets/image/arrow_down.svg';
import arrow_right from '@src/assets/image/arrow_right.svg';
import ToggleUI from '@src/components/toggleui';
import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useRole } from '../../../context/RoleContext';
import CommonUtils from '@src/util/CommonUtils';
import { RoleStatusEnum } from './Constants';


const INITIAL_FILTER_STATE = {
  dateRange: [],
  searchQuery: '',
  status: [],
};

const statusOptions = Object.values(RoleStatusEnum).map(item => ({
  label: item,
  value: item,
}))

const FilterPanel = () => {
  const {
    filterConfig,
    filterConfig: { searchQuery, dateRange },
    clearFilters,
    applyFilters
  } = useRole();
  const [filters, setFilters] = React.useState(INITIAL_FILTER_STATE);
  const [appliedFilters, setAppliedFilters] = React.useState(INITIAL_FILTER_STATE);
  const [dateErrors, setDateErrors] = React.useState([]);
  const { t } = useTranslate();

  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const handleExpandCard = () => {
    setIsCardExpanded((prevExpandedCard) => !prevExpandedCard);
  };

  const handleSearch = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchQuery: event.target.value
    }));
  };

  const handleOnDateRangeChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      dateRange: value
    }));
    setDateErrors([]);
  };

  const onSearchableDropdownChange = (value) => {
    const filteredValue = value.filter((item) => item.isChecked);
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: filteredValue.map((item) => item.value)
    }));
  }

  const handleClearFilters = () => {
    setAppliedFilters(INITIAL_FILTER_STATE);
    setFilters(INITIAL_FILTER_STATE);
  };

  const handleOnApplyFilter = (event) => {
    event.preventDefault();

    if(filters.dateRange[0] && !filters.dateRange[1]){
      dateErrors[1] = "Please select end date";
      setDateErrors([...dateErrors]);
      return;
    }else if(!filters.dateRange[0] && filters.dateRange[1]){
      dateErrors[0] = "Please select start date";
      setDateErrors([...dateErrors]);
      return;
    }

    const updatedFilter = {
      ...filters,
      dateRange: filters.dateRange.map(item => CommonUtils.convertDate(item)),
    }
    setAppliedFilters({ ...updatedFilter });
    applyFilters(updatedFilter);
  };

  const areFiltersEqual = CommonUtils.deepEqual(appliedFilters, filters);

  const controlButtons = !areFiltersEqual ? (
    <div className="filter-control-buttons">
      <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />
      <Button type="submit" size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" />
    </div>
  ) : null;

  return (
    <form onSubmit={handleOnApplyFilter}>
      <div className="MCP-filter-panel">
        <div className="filter-header">
          <div className="search-box">
            <button type="button" onClick={handleExpandCard}>
              <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
            </button>
            <div className={'ctrl-search-box'}>
              <InputField errors={{}} id="search-box" name="firstName" value={filters.searchQuery} onInputChange={handleSearch} tooltipText={null} useRegister={false} placeholder={t('orgManagement.role.placeholder')} />
            </div>
          </div>
          {!isCardExpanded && controlButtons ? controlButtons : null}
        </div>
        <ToggleUI in={isCardExpanded} timeout={400}>
          <div className="additional-filters">
            <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
              <div className="custom-date-range-picker">
                <DateRangePicker 
                  dateRange={filters.dateRange || []} 
                  onChange={handleOnDateRangeChange} 
                  size="lg"
                  minDate={new Date('-1')}
                  isStartDateError={Boolean(dateErrors[0])}
                  // startDateHelperMessage={dateErrors[0]}
                  isEndDateError={Boolean(dateErrors[1])}
                  // endDateHelperMessage={dateErrors[1]}
                  maxDate={new Date()}
                />
              </div>
              <SearchableDropdown
                id="status"
                isSuccess
                value={filters.status}
                label={t('userManagement.table.status')}
                name={t('userManagement.table.status')}
                isRequired={false}
                onChange={onSearchableDropdownChange}
                options={statusOptions}
                clearAllSelectedValues={() => setStatus([])}
              />
              {isCardExpanded && controlButtons ? <div className="expanded">{controlButtons}</div> : null}
            </div>
          </div>
        </ToggleUI>
      </div>
    </form>
  );
};

export default FilterPanel;
