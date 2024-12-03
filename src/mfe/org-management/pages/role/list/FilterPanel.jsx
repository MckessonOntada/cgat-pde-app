import { Button, ProgressButton, DateRangePicker, Divider, InputField } from '@mckesson/mcp-component-library';
import arrow_down from '@src/assets/image/arrow_down.svg';
import arrow_right from '@src/assets/image/arrow_right.svg';
import ToggleUI from '@src/components/toggleui';
import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useRole } from '../../../context/RoleContext';
import CommonUtils from '@src/util/CommonUtils';

const FilterPanel = () => {
  const {
    filterConfig,
    filterConfig: { searchQuery, dateRange },
    clearFilters,
    applyFilters
  } = useRole();
  const [filters, setFilters] = React.useState({
    dateRange: [],
    searchQuery: ''
  });
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
  };

  const handleClearFilters = () => {
    clearFilters();
    setFilters({
      searchQuery: '',
      dateRange: []
    });
  };

  const handleOnApplyFilter = (event) => {
    event.preventDefault();
    applyFilters({ ...filters });
  };

  const isClearFiltersButtonVisible = searchQuery || dateRange.length > 0;
  const areFiltersEqual = CommonUtils.deepEqual(filterConfig, filters);

  const controlButtons = (
    <div className="filter-controls">
      {isClearFiltersButtonVisible && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
      {!areFiltersEqual && <Button type="submit" size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" />}
    </div>
  );

  return (
    <form onSubmit={handleOnApplyFilter}>
      <div className="filter-panel">
        <div className="header">
          <div className="header-segment">
            <button type="button" onClick={handleExpandCard}>
              <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
            </button>
            <div className={'ctrl-search-box autoSuggestSearch-container'}>
              <InputField errors={{}} id="search-box" name="firstName" value={filters.searchQuery} onInputChange={handleSearch} tooltipText={null} useRegister={false} placeholder={t('orgManagement.role.placeholder')} />
            </div>
          </div>
          <div>{!isCardExpanded && controlButtons}</div>
        </div>
        <ToggleUI in={isCardExpanded} timeout={400}>
          <div className="filter-body">
            <div className="filter-controls">
              <div className="filter-segment">
                <DateRangePicker dateRange={filters?.dateRange || []} onChange={handleOnDateRangeChange} />
              </div>
              {isCardExpanded && controlButtons}
            </div>
          </div>
        </ToggleUI>
      </div>
    </form>
  );
};

export default FilterPanel;
