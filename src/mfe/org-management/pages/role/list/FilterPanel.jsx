import React, { useState, useEffect } from 'react';
import {
  DateRangePicker,
  Button,
  Divider,
  InputField
} from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import { useRole } from '../../../context/RoleContext';

const FilterPanel = () => {
  const { filterConfig: { searchQuery, dateRange }, clearFilters, applyFilters } = useRole();
  const [filters, setFilters] = React.useState({});
  const { t } = useTranslate();

  const [expandedCard, setExpandedCard] = useState(false);

  const [isClearFiltersVisible, setIsClearFiltersVisible] = useState(false);

  const handleExpandCard = () => {
    setExpandedCard((prevExpandedCard) => !prevExpandedCard);
  };

  const handleSearch = (event) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      searchQuery: event.target.value
    }))
  };

  useEffect(() => {
    setIsClearFiltersVisible(
      (searchQuery && searchQuery.length > 0) ||
      (dateRange && dateRange.find(d => Boolean(d).length === 2))
    );
  }, [searchQuery, dateRange]);

  const handleOnDateRangeChange = (value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      dateRange: value
    }))
  }

  const handleClearFilters = () => {
    setFilters({});
    clearFilters();
  };

  const handleOnApplyFilter = () => {
    applyFilters({ ...filters });
  };

  return (
    <div>
      <div className='filter-panel-header'>
        <div className="filter-main-search-box">
          <button onClick={handleExpandCard}>
            <img
              src={expandedCard ? arrow_down : arrow_right}
              alt="toggle-icon"
            />
          </button>
          <div className="autoSuggestSearch-container">
            <InputField
              errors={{}}
              id="search-box"
              name="firstName"
              value={filters.searchQuery}
              onInputChange={handleSearch}
              tooltipText={null}
              useRegister={false}
              placeHolder={t('orgManagement.role.placeholder')}
            />
          </div>
        </div>
        <Button
          type="button"
          size="md"
          label={t('orgManagement.button.filter')}
          className="filter-btn"
          onClick={handleOnApplyFilter}
        />
      </div>

      <ToggleUI in={expandedCard} timeout={400}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
          <Divider />
          <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            <DateRangePicker dateRange={filters?.dateRange || []} onChange={handleOnDateRangeChange} />
            <div className="LabelBox">

              {isClearFiltersVisible && (
                <Button
                  type="button"
                  size="md"
                  label={t('orgManagement.clearFilter.label')}
                  textButton
                  className="txtbtn"
                  onClick={handleClearFilters}
                />
              )}
            </div>
          </div>
        </div>
      </ToggleUI>
    </div>
  );
};

export default FilterPanel;
