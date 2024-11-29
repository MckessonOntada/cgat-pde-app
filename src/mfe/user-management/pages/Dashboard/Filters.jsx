import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import {
  AutoSuggestSearch,
  Button,
  Divider,
  SearchableDropdown
} from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ROLES, STATUS } from '../../mockData/UsersData';
import './index.scss';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import { debugIds, ID } from '@src/constants/id';

const Filters = ({ showRoleDropdown = false, showStatusDropdown = false }) => {
  const { t } = useTranslate();
  const {
    filterConfig,
    paginationConfig,
    setFilterConfig,
    applyFilters,
    clearFilters
  } = useUser();
  const [filters, setFilters] = React.useState({});
  const [expandedCard, setExpandedCard] = useState(false);
  const [isClearFiltersVisible, setIsClearFiltersVisible] = useState(false);

  const handleExpandCard = () => {
    setExpandedCard(!expandedCard);
  };


  const handleSearchChange = (inputValue) => {
    setSearchQuery(inputValue);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  const isClearFiltersButtonVisible = !!(
    filterConfig.searchQuery ||
    filterConfig.role ||
    (Array.isArray(filterConfig.status) && filterConfig.status.length > 0)
  );

  const handleFilter = () => {
    applyFilters(filters);
  };

  const onSearchableDropdownChange = (type, value) => {
    const filteredValue = value.filter((item) => item.isChecked);
    applyFilters({ [type]: filteredValue.map(item => item.value) });
  };

  return (
    <div className="filterBox" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
      {(showRoleDropdown && ROLES.length > 0) || (showStatusDropdown && STATUS.length > 0) ? (
        <>
          <div className="toggle-box">
            <button onClick={handleExpandCard}>
              {expandedCard ? (
                <img src={arrow_down} className="icon-align" />
              ) : (
                <img src={arrow_right} className="icon-align" />
              )}
            </button>
            <div className="autoSuggestSearch-container">
              <AutoSuggestSearch
                label=" "
                value={filters.searchQuery}
                onChangeInput={handleSearchChange}
                outline={true}
                placeHolder={t('userManagement.searchFilter.label')}
              />
            </div>
          </div>

          {/* Render contents only if expandedCard is true */}

          <ToggleUI in={expandedCard} timeout={400}>
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

                <div className="LabelBox">
                  <Button
                    type="button"
                    label={t('filter')}
                    onClick={handleFilter}
                    className="filter-btn"
                  />
                  {isClearFiltersButtonVisible && (
                    <Button
                      type="button"
                      label={t('userManagement.clearFilter.label')}
                      textButton
                      className="txtbtn"
                      onClick={handleClearFilters}
                    />
                  )}
                </div>
              </div>
            </div>
          </ToggleUI>
        </>
      ) : null}
    </div>
  );
};

export default Filters;
