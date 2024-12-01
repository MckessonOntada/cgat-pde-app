import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { AutoSuggestSearch, Button, Divider, SearchableDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ROLES, STATUS } from '../../mockData/UsersData';
import './index.scss';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import { debugIds, ID } from '@src/constants/id';

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

  const handleSearchChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchQuery: value
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

  const handleOnApplyFilter = () => {
    applyFilters({ ...filters });
  };

  const isClearFiltersButtonVisible = !!(filterConfig.searchQuery || filterConfig.role || (Array.isArray(filterConfig.status) && filterConfig.status.length > 0));

  const onSearchableDropdownChange = (type, value) => {
    const filteredValue = value.filter((item) => item.isChecked);
    applyFilters({ [type]: filteredValue.map((item) => item.value) });
  };

  const isButtonPanelVisible = deepEqual(filterConfig, filters);

  return (
    <div className="filterBox" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
      {(showRoleDropdown && ROLES.length > 0) || (showStatusDropdown && STATUS.length > 0) ? (
        <>
          <div className="filter-panel-header">
            <div className="filter-controls">
              <button onClick={handleExpandCard}>{isCardExpanded ? <img src={arrow_down} className="icon-align" /> : <img src={arrow_right} className="icon-align" />}</button>
              <div className="autoSuggestSearch-container">
                <AutoSuggestSearch label=" " value={filters.searchQuery} onChangeInput={handleSearchChange} outline={true} placeHolder={t('userManagement.searchFilter.label')} />
              </div>
            </div>
            {!isCardExpanded && (
              <div className="filter-main-search-box">
                <div className="filter-controls">
                  {(searchQuery || role.length > 0 || status.length > 0) && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
                  <Button type="button" disabled={isButtonPanelVisible} size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" onClick={handleOnApplyFilter} />
                </div>
              </div>
            )}
          </div>

          {/* Render contents only if isCardExpanded is true */}

          <ToggleUI in={isCardExpanded} timeout={400}>
            <div className="expanded-content" style={{ paddingBottom: '200px' }}>
              <Divider color={'#BAC5CC'} />
              <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {showRoleDropdown && ROLES.length > 0 && (
                  <SearchableDropdown
                    id="role"
                    isSuccess
                    value={filterConfig.role}
                    label={t('userManagement.table.role')}
                    name={t('userManagement.table.role')}
                    isRequired={false}
                    onChange={(value) => onSearchableDropdownChange('role', value)}
                    options={ROLES}
                    clearAllSelectedValues={() => setRole([])}
                  />
                )}

                {showStatusDropdown && STATUS.length > 0 && (
                  <SearchableDropdown
                    id="status"
                    isSuccess
                    value={status}
                    label={t('userManagement.table.status')}
                    name={t('userManagement.table.status')}
                    isRequired={false}
                    onChange={(value) => onSearchableDropdownChange('status', value)}
                    options={STATUS}
                    clearAllSelectedValues={() => setStatus([])}
                  />
                )}

                {isCardExpanded && (
                  <div className="filter-main-search-box">
                    <div className="filter-controls">
                      {(searchQuery || role.length > 0 || status.length > 0) && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
                      <Button type="button" disabled={isButtonPanelVisible} size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" onClick={handleOnApplyFilter} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ToggleUI>
        </>
      ) : null}
    </div>
  );
};

export default Filters;
