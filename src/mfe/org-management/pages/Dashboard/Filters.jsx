import React, { useState, useEffect } from 'react';
import { useOrg } from '../../context/OrgContext';
import { InputField, Button, Divider, SearchableDropdown } from '@mckesson/mcp-component-library';
import { LOCATIONS, STATUS } from '../../mockData/orgData';
import { useTranslate } from '@src/translations/useTranslation';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import { debugIds, ID } from '@src/constants/id';
import './index.scss';

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

const Filters = ({ showLocationDropdown = false, showStatusDropdown = false }) => {
  const { t } = useTranslate();
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isClearFiltersVisible, setIsClearFiltersVisible] = useState(false);
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

  const handleOnApplyFilter = () => {
    applyFilters({ ...filters });
  };

  const onSearchableDropdownChange = (type, value) => {
    const filteredValue = value.filter((item) => item.isChecked);
    if (filteredValue && filteredValue.length > 0) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [type]: filteredValue.map(item => item.value)
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

  const isButtonPanelVisible = deepEqual(filterConfig, filters);

  return (
    <div className="filterBox line-height" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
      {(showLocationDropdown || showStatusDropdown) && (
        <>
          <div className="toggle-container">
            <div className="toggle-box">
              <div onClick={handleExpandCard}>
                <img src={isCardExpanded ? arrow_down : arrow_right} className="icon-align" alt="toggle-icon" />
              </div>
              <div className="autoSuggestSearch-container">
                <InputField 
                  id="search-box"
                  name="org-grid-search-query"
                  value={filters.searchQuery}
                  onInputChange={handleSearch}
                  tooltipText={null}
                  useRegister={false}
                  placeHolder={t('orgManagement.role.placeholder')}
                />
              </div>
            </div>
            {!isCardExpanded && (
              <div className="filter-main-search-box">
                <div className="filter-controls">
                  {(searchQuery || location.length > 0 || status.length > 0) && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
                  <Button type="button" disabled={isButtonPanelVisible} size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" onClick={handleOnApplyFilter} />
                </div>
              </div>
            )}
          </div>
          <ToggleUI in={isCardExpanded} timeout={400}>
            <div className="expanded-content" style={{paddingBottom: '300px'}}>
              <Divider />
              <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {showLocationDropdown && (
                  <SearchableDropdown
                    id="location"
                    isSuccess
                    value={location}
                    label={t('orgManagement.table.location')}
                    name={t('orgManagement.table.location')}
                    isRequired={false}
                    onChange={(value) => onSearchableDropdownChange('location', value)}
                    options={LOCATIONS}
                    clearAllSelectedValues={() => setLocation([])}
                  />
                )}

                {showStatusDropdown && (
                  <SearchableDropdown
                    id="status"
                    isSuccess
                    value={status}
                    label={t('orgManagement.table.status')}
                    name={t('orgManagement.table.status')}
                    isRequired={false}
                    onChange={(value) => onSearchableDropdownChange('status', value)}
                    options={STATUS}
                    clearAllSelectedValues={() => setStatus([])}
                  />
                )}

                {isCardExpanded && (
                  <div className="filter-main-search-box">
                    <div className="filter-controls">
                      {(searchQuery || location.length > 0 || status.length > 0) && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
                      <Button type="button" disabled={isButtonPanelVisible} size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" onClick={handleOnApplyFilter} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ToggleUI>
        </>
      )}
    </div>
  );
};

export default Filters;
