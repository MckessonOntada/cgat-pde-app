import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { InputField, Button, Divider, SearchableDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ROLES, STATUS } from '../../mockData/UsersData';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';

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

const Filters = ({ showRoleDropdown = false, showStatusDropdown = false }) => {
  const { t } = useTranslate();
  const {
    filterConfig,
    filterConfig: { searchQuery, role, status },
    clearFilters,
    applyFilters
  } = useUser();
  const [filters, setFilters] = React.useState({
    searchQuery: '',
    role: [],
    status: []
  });
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  const handleExpandCard = () => {
    setIsCardExpanded(!isCardExpanded);
  };

  const handleSearchChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchQuery: event.target.value
    }));
  };

  const handleClearFilters = () => {
    clearFilters();
    setFilters({
      searchQuery: '',
      role: [],
      status: []
    });
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    applyFilters({ ...filters });
  };

  const onSearchableDropdownChange = (type, value) => {
    const filteredValue = value.filter((item) => item.isChecked);
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: filteredValue.map((item) => item.value)
    }));
  };

  const isClearFiltersButtonVisible = searchQuery || role.length > 0 || status.length > 0;
  const isFilterChanged = deepEqual(filterConfig, filters);

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="filter-panel">
        <div className="header">
          <div className="header-segment">
            <button type="button" onClick={handleExpandCard}>
              <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
            </button>
            <div className={'ctrl-search-box'}>
              <InputField id="user-grid-search-box" name="searchQuery" value={filters.searchQuery} useRegister={false} onInputChange={handleSearchChange} placeHolder={''} />
            </div>
          </div>
          <div>
            {!isCardExpanded && (
              <div className="filter-controls">
                {isClearFiltersButtonVisible && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
                <Button type="submit" disabled={isFilterChanged} size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" />
              </div>
            )}
          </div>
        </div>
        <ToggleUI in={isCardExpanded} timeout={400}>
          <div className="filter-body" style={{paddingBottom: '300px'}}>
            <div className="filter-controls">
              <div className="filter-segment">
                <SearchableDropdown
                  id="role"
                  isSuccess
                  value={filters.role}
                  label={t('userManagement.table.role')}
                  name={t('userManagement.table.role')}
                  isRequired={false}
                  onChange={(value) => onSearchableDropdownChange('role', value)}
                  options={ROLES}
                  clearAllSelectedValues={() => setRole([])}
                />
              </div>
              <div className="filter-segment">
                <SearchableDropdown
                  id="status"
                  isSuccess
                  value={filters.status}
                  label={t('userManagement.table.status')}
                  name={t('userManagement.table.status')}
                  isRequired={false}
                  onChange={(value) => onSearchableDropdownChange('status', value)}
                  options={STATUS}
                  clearAllSelectedValues={() => setStatus([])}
                />
              </div>
              {isCardExpanded && (
                <div className="filter-controls">
                  {isClearFiltersButtonVisible && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
                  <Button type="submit" disabled={isFilterChanged} size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" />
                </div>
              )}
            </div>
          </div>
        </ToggleUI>
      </div>
    </form>
  );
};

export default Filters;
