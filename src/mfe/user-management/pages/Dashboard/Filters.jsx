import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { InputField, Button, AutoSuggestDropdown, SearchableDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { ROLES, STATUS } from '../../mockData/UsersData';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import CommonUtils from '@src/util/CommonUtils';

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  role: [],
  status: []
};

const Filters = ({ showRoleDropdown = false, showStatusDropdown = false }) => {
  const { t } = useTranslate();
  const {
    roleList,
    filterConfig,
    filterConfig: { searchQuery, role, status },
    clearFilters,
    applyFilters
  } = useUser();
  const [filters, setFilters] = React.useState(INITIAL_FILTER_STATE);
  const [appliedFilters, setAppliedFilters] = React.useState(INITIAL_FILTER_STATE);
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
    setValue('');
    setFilters(INITIAL_FILTER_STATE);
    setAppliedFilters(INITIAL_FILTER_STATE);
  };

  const handleOnSubmit = (event) => {
    event.preventDefault();
    setAppliedFilters({ ...filters });
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
    setValue(e.value);
    setFilters((prevFilters) => ({
      ...prevFilters,
      role: e.value
    }));
  };

  const areFiltersEqual = CommonUtils.deepEqual(appliedFilters, filters);
  // const availableOptions = roleList ? roleList.map(item => ({label: item.name, value: item.name})) : [];

  const controlButtons = !areFiltersEqual ? (
    <div className="filter-control-buttons">
      <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />
      <Button type="submit" size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" />
    </div>
  ) : null;

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="MCP-filter-panel">
        <div className="filter-header">
          <div className="search-box">
            <button type="button" onClick={handleExpandCard}>
              <img src={isCardExpanded && controlButtons ? arrow_down : arrow_right} alt="toggle-icon" />
            </button>
            <div className={'ctrl-search-box'}>
              <InputField id="user-grid-search-box" name="searchQuery" value={filters.searchQuery} useRegister={false} onInputChange={handleSearchChange} placeholder={t('userManagement.placeholder.searchByNameAndLocation')} />
            </div>
          </div>
          {!isCardExpanded ? controlButtons : null}
        </div>
        <ToggleUI in={isCardExpanded} timeout={400}>
          <div className="additional-filters">
            <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
              <div className="custom-autosuggest-dropdown">
                <AutoSuggestDropdown getselectedValue={handleOnSelectedValue} onChangeInput={() => {}} label={t('userManagement.label.role')} selectedVal={value} key={value} suggestionList={roleList} />
              </div>
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
              {isCardExpanded && controlButtons ? <div className="expanded">{controlButtons}</div> : null}
            </div>
          </div>
        </ToggleUI>
      </div>
    </form>
  );
};

export default Filters;
