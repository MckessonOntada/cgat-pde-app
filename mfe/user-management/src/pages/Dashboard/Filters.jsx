import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/PageContext';
import { AutoSuggestSearch, Button, Divider, SearchableDropdown } from '@mckesson/mcp-component-library';
import { useTranslation } from 'react-i18next';
import { ROLES, STATUS } from '../../mockData/UsersData';
import arrow_right from '../../assets/images/arrow_right.svg';
import arrow_down from '../../assets/images/arrow_down.svg';
import './index.scss';

const Filters = ({ showRoleDropdown = false, showStatusDropdown = false }) => {
  const { t } = useTranslation();
  const [expandedCard, setExpandedCard] = useState(false);
  const [isClearFiltersVisible, setIsClearFiltersVisible] = useState(false);

  const handleExpandCard = () => {
    setExpandedCard(!expandedCard);
  };

  const {
    filters: {
      searchQuery,
      role,
      update: { setRole, setStatus, setSearchQuery },
      status,
      clearFilters,
      applyFilters,
    },
  } = useUser();

  const handleSearchChange = inputValue => {
    setSearchQuery(inputValue);
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  useEffect(() => {
    setIsClearFiltersVisible(
      (searchQuery && searchQuery.length > 0) || (role && role.length > 0) || (status && status.length > 0),
    );
  }, [searchQuery, role, status]);

  const handleFilter = () => {
    alert(
      `Search Query: ${searchQuery}\nFiltered Roles: ${JSON.stringify(role)}\nFiltered Status: ${JSON.stringify(
        status,
      )}`,
    );
    applyFilters();
  };

  const onSearcheableDropdownChange = (type, value) => {
    const filteredValue = value.filter(item => item.isChecked);
    if (type === 'role') {
      setRole(filteredValue);
    }
    if (type === 'status') {
      setStatus(filteredValue);
    }
  };

  return (
    <div className="filterBox">
      {(showRoleDropdown && ROLES.length > 0) || (showStatusDropdown && STATUS.length > 0) ? (
        <>
          <div className="toggle-box">
            <div onClick={handleExpandCard}>
              {expandedCard ? (
                <img src={arrow_down} className="icon-align" />
              ) : (
                <img src={arrow_right} className="icon-align" />
              )}
            </div>
            <div className="autoSuggestSearch-container">
              <AutoSuggestSearch
                label=" "
                value={searchQuery}
                onChangeInput={handleSearchChange}
                outline={true}
                placeHolder={t('search_by_name_or_email')}
              />
            </div>
          </div>

          {/* Render contents only if expandedCard is true */}
          {expandedCard && (
            <>
              <Divider color={'#BAC5CC'} />

              <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {showRoleDropdown && ROLES.length > 0 && (
                  <SearchableDropdown
                    id="role"
                    isSuccess
                    value={role}
                    label={t('role')}
                    name={t('role')}
                    isRequired={false}
                    onChange={value => onSearcheableDropdownChange('role', value)}
                    options={ROLES}
                    clearAllSelectedValues={() => setRole([])}
                  />
                )}

                {showStatusDropdown && STATUS.length > 0 && (
                  <SearchableDropdown
                    id="status"
                    isSuccess
                    value={status}
                    label={t('status')}
                    name={t('status')}
                    isRequired={false}
                    onChange={value => onSearcheableDropdownChange('status', value)}
                    options={STATUS}
                    clearAllSelectedValues={() => setStatus([])}
                  />
                )}

                <div className="LabelBox">
                  <Button type="button" label={t('filter')} onClick={handleFilter} />
                  {isClearFiltersVisible && (
                    <Button
                      type="button"
                      label={t('clear_filters')}
                      textButton
                      className="txtbtn"
                      onClick={handleClearFilters}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default Filters;
