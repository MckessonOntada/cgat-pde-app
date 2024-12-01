import { Button, DateRangePicker, Divider, InputField } from '@mckesson/mcp-component-library';
import arrow_down from '@src/assets/image/arrow_down.svg';
import arrow_right from '@src/assets/image/arrow_right.svg';
import ToggleUI from '@src/components/toggleui';
import { useTranslate } from '@src/translations/useTranslation';
import React, { useState } from 'react';
import { useRole } from '../../../context/RoleContext';

function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;

  if (obj1 === null || obj2 === null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
}

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

  const handleOnApplyFilter = () => {
    applyFilters({ ...filters });
  };

  const isButtonPanelVisible = deepEqual(filterConfig, filters);

  console.log(filters);

  return (
    <div>
      <div className="filter-panel-header">
        <div className="filter-controls">
          <button onClick={handleExpandCard}>
            <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
          </button>
          <div className="autoSuggestSearch-container">
            <InputField errors={{}} id="search-box" name="firstName" value={filters.searchQuery} onInputChange={handleSearch} tooltipText={null} useRegister={false} placeHolder={t('orgManagement.role.placeholder')} />
          </div>
        </div>
        {!isCardExpanded && (
          <div className="filter-main-search-box">
            <div className="filter-controls">
              {(searchQuery || dateRange.length > 0) && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
              <Button type="button" disabled={isButtonPanelVisible} size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" onClick={handleOnApplyFilter} />
            </div>
          </div>
        )}
      </div>

      <ToggleUI in={isCardExpanded} timeout={400}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <Divider />
          <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            <DateRangePicker dateRange={filters?.dateRange || []} onChange={handleOnDateRangeChange} />
            {isCardExpanded && (
              <div className="filter-main-search-box">
                <div className="filter-controls">
                  {(searchQuery || dateRange.length > 0) && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
                  <Button type="button" disabled={isButtonPanelVisible} size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" onClick={handleOnApplyFilter} />
                </div>
              </div>
            )}
          </div>
        </div>
      </ToggleUI>
    </div>
  );
};

export default FilterPanel;
