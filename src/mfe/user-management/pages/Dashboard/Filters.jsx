import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { InputField, Button, AutoSuggestDropdown, SearchableDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ROLES, STATUS } from '../../mockData/UsersData';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import CommonUtils from '@src/util/CommonUtils';

const Filters = ({ showRoleDropdown = false, showStatusDropdown = false }) => {
  const { t } = useTranslate();
  const {
    roleList,
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
  const [value, setValue] = React.useState('');

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
    setValue('');
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

  const handleOnSelectedValue = (e) => {
    setValue(e.value)
    setFilters((prevFilters) => ({
      ...prevFilters,
      'role': e.value
    }))
  }

  const isClearFiltersButtonVisible = searchQuery || role.length > 0 || status.length > 0;
  const areFiltersEqual = CommonUtils.deepEqual(filterConfig, filters);
  // const availableOptions = roleList ? roleList.map(item => ({label: item.name, value: item.name})) : [];

  const controlButtons = (
    <div className="filter-controls">
      {isClearFiltersButtonVisible && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
      {!areFiltersEqual && <Button type="submit" size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" /> }
    </div>
  );

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="filter-panel">
        <div className="header">
          <div className="header-segment">
            <button type="button" onClick={handleExpandCard}>
              <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
            </button>
            <div className={'ctrl-search-box'}>
              <InputField id="user-grid-search-box" name="searchQuery" value={filters.searchQuery} useRegister={false} onInputChange={handleSearchChange} placeholder={t('userManagement.placeholder.searchByNameAndLocation')} />
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
              <AutoSuggestDropdown
                getselectedValue={handleOnSelectedValue} 
                onChangeInput={() => {}}
                label={t('userManagement.label.role')} 
                selectedVal={value} 
                key={value} 
                suggestionList={roleList}
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
              {isCardExpanded && controlButtons}
            </div>
          </div>
        </ToggleUI>
      </div>
    </form>
  );
};

export default Filters;
