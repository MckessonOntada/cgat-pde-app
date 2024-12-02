import React, { useState, useEffect } from 'react';
import { useOrg } from '../../context/OrgContext';
import { InputField, Button, Divider, SearchableDropdown } from '@mckesson/mcp-component-library';
import { LOCATIONS, STATUS } from '../../mockData/orgData';
import { useTranslate } from '@src/translations/useTranslation';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import CommonUtils from '@src/util/CommonUtils';
import './index.scss';

const Filters = ({ showLocationDropdown = false, showStatusDropdown = false }) => {
  const { t } = useTranslate();
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const {
    filterConfig,
    filterConfig: { searchQuery, location, status },
    applyFilters,
    clearFilters
  } = useOrg();
  const [filters, setFilters] = React.useState({
    searchQuery: '',
    location: [],
    status: []
  });

  const handleExpandCard = () => {
    setIsCardExpanded((prevExpandedCard) => !prevExpandedCard);
  };

  const handleSearch = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchQuery: event.target.value
    }));
  };

  // useEffect(() => {
  //   setIsClearFiltersVisible(
  //     (searchQuery && searchQuery.length > 0) ||
  //       (location && location.length > 0) ||
  //       (status && status.length > 0)
  //   );
  // }, [searchQuery, location, status]);

  const handleOnSubmit = (event) => {
    event.preventDefault();
    applyFilters({ ...filters });
  };

  const onSearchableDropdownChange = (type, value) => {
    const filteredValue = value.filter((item) => item.isChecked);
    if (filteredValue && filteredValue.length > 0) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [type]: filteredValue.map((item) => item.value)
      }));
    }
  };

  const handleClearFilters = () => {
    clearFilters();
    setFilters({
      searchQuery: '',
      location: [],
      status: []
    });
  };

  const areFiltersEqual = CommonUtils.deepEqual(filterConfig, filters);
  const isClearFiltersButtonVisible = searchQuery || location.length > 0 || status.length > 0;

  const controlButtons = (
    <div className="filter-controls">
      { isClearFiltersButtonVisible && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
      { !areFiltersEqual && <Button type="submit" size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" /> }
    </div>
  )

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="filter-panel">
        <div className="header">
          <div className="header-segment">
            <button type="button" onClick={handleExpandCard} disabled={true}>
              <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
            </button>
            <div className={'ctrl-search-box'}>
              <InputField id="search-box" name="org-grid-search-query" value={filters.searchQuery} onInputChange={handleSearch} tooltipText={null} useRegister={false} placeholder={t('orgManagement.role.placeholder')} />
            </div>
          </div>
          <div>
            {!isCardExpanded && controlButtons}
          </div>
        </div>
        <ToggleUI in={isCardExpanded} timeout={400}>
          <div className="filter-body" style={{paddingBottom: '300px'}}>
            <div className="filter-controls">
              <div className="filter-segment">
                <SearchableDropdown
                  id="location"
                  isSuccess
                  value={filters.location}
                  label={t('orgManagement.table.location')}
                  name={t('orgManagement.table.location')}
                  isRequired={false}
                  onChange={(value) => onSearchableDropdownChange('location', value)}
                  options={LOCATIONS}
                  clearAllSelectedValues={() => setLocation([])}
                />
              </div>
              <div className="filter-segment">
                <SearchableDropdown
                  id="status"
                  isSuccess
                  value={filters.status}
                  label={t('orgManagement.table.status')}
                  name={t('orgManagement.table.status')}
                  isRequired={false}
                  onChange={(value) => onSearchableDropdownChange('status', value)}
                  options={STATUS}
                  clearAllSelectedValues={() => setStatus([])}
                />
              </div>
              {isCardExpanded && controlButtons}
            </div>
          </div>
        </ToggleUI>
      </div>
    </form>
  );
};

export default Filters;
