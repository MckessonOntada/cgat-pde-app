import { Button, DateRangePicker, InputField } from '@mckesson/mcp-component-library';
import arrow_down from '@src/assets/image/arrow_down.svg';
import arrow_right from '@src/assets/image/arrow_right.svg';
import ToggleUI from '@src/components/toggleui';
import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useRole } from '../../../context/RoleContext';
import CommonUtils from '@src/util/CommonUtils';
// import DateRangePicker from '../../../../../components/date-picker';


const INITIAL_FILTER_STATE = {
  dateRange: CommonUtils.getDateRange(1),
  searchQuery: ''
};

const FilterPanel = () => {
  const {
    filterConfig,
    filterConfig: { searchQuery, dateRange },
    clearFilters,
    applyFilters
  } = useRole();
  const [filters, setFilters] = React.useState(INITIAL_FILTER_STATE);
  const [appliedFilters, setAppliedFilters] = React.useState(INITIAL_FILTER_STATE);
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
    setAppliedFilters(INITIAL_FILTER_STATE);
    setFilters(INITIAL_FILTER_STATE);
  };

  const handleOnApplyFilter = (event) => {
    event.preventDefault();
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
              <DateRangePicker 
                dateRange={filters.dateRange || []} 
                onChange={handleOnDateRangeChange} 
                minDate={new Date('-1')}
                maxDate={new Date()}
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
