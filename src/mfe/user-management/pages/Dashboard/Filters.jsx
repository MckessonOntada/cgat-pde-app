import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { InputField, Button, DateRangePicker, SearchableDropdown } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { STATUS } from '../../mockData/UsersData';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import CommonUtils from '@src/util/CommonUtils';
import { useQuery } from 'react-query';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';
import { serializeParams } from '@src/util/ApiUtils';
import AuthUtils from '@src/util/AuthUtils';

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  role: [],
  status: [],
  dateRange: []
};

const Filters = ({ showRoleDropdown = false, showStatusDropdown = false }) => {
  const { t } = useTranslate();
  const {
    filterConfig,
    filterConfig: { searchQuery, role, status },
    clearFilters,
    applyFilters
  } = useUser();
  const [filters, setFilters] = React.useState(INITIAL_FILTER_STATE);
  const [appliedFilters, setAppliedFilters] = React.useState(INITIAL_FILTER_STATE);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [roleFilterQuery, setRoleFilterQuery] = React.useState(null);
  const [value, setValue] = React.useState('');
  const isSystemAdminView = AuthUtils.isSystemAdminView();

  const { data: roleList = [], refetch: refreshRoleList } = useQuery({
    queryKey: ['user', 'roles-list', 'role-query'],
    queryFn: async () => {
      let params = {};
      if (roleFilterQuery) {
        params.query = roleFilterQuery;
      }
      const response = await HttpResourceService.callRest(`${ApiRoutes.GET_ROLES()}?${serializeParams(params)}`, httpVerb.GET, {});
      if (response.data) {
        const { content: data } = response.data;
        return data.map((item) => ({
          label: item.name,
          value: item.name
        }));
      }
      return [];
    },
    refetchOnWindowFocus: false
  });

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
    clearFilters();
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

  const handleOnDateRangeChange = (value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      dateRange: value
    }));
  };
  React.useEffect(() => {
    refreshRoleList();
  }, [roleFilterQuery]);

  const handleOnRoleFilterQueryChange = (query) => {
    setRoleFilterQuery(query);
  };

  const handleOnSelectedValue = (changedOptions) => {
    const filteredOptions = changedOptions.filter((item) => item.isChecked);
    setValue(filteredOptions.map((item) => item.value));
    setFilters((prevFilters) => ({
      ...prevFilters,
      ['role']: filteredOptions.map((item) => item.value)
    }));
  };

  const areFiltersEqual = CommonUtils.deepEqual(appliedFilters, filters);
  const anyFilterIsApplied = Object.values(appliedFilters).some((filter) => filter && filter.length > 0);

  const controlButtons =
    anyFilterIsApplied || !areFiltersEqual ? (
      <div className="filter-control-buttons">
        {anyFilterIsApplied && <Button type="button" size="md" label={t('orgManagement.clearFilter.label')} textButton className="txtbtn" onClick={handleClearFilters} />}
        {!areFiltersEqual && <Button type="submit" size="md" variant="secondary" label={t('orgManagement.button.filter')} className="filter-btn" />}
      </div>
    ) : null;

  return (
    <form onSubmit={handleOnSubmit}>
      <div className="MCP-filter-panel">
        <div className="filter-header">
          <div className="search-box">
            <button type="button" onClick={handleExpandCard}>
              <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
            </button>
            <div className={'ctrl-search-box autoSuggestSearch-container'}>
              <InputField id="user-grid-search-box" name="searchQuery" value={filters.searchQuery} useRegister={false} onInputChange={handleSearchChange} placeholder={t('userManagement.placeholder.searchByNameAndemail')} />
            </div>
          </div>
          {controlButtons}
        </div>
        <ToggleUI in={isCardExpanded} timeout={400}>
          <div className="additional-filters">
            <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
              {!isSystemAdminView && <SearchableDropdown selectedVal={value} onChange={handleOnSelectedValue} variant="async" label={t('userManagement.label.role')} asyncHandleSearch={handleOnRoleFilterQueryChange} options={roleList} />}
              <SearchableDropdown
                id="status"
                isSuccess
                value={filters.status}
                label={t('userManagement.table.status')}
                name={t('userManagement.table.status')}
                isRequired={false}
                onChange={(value) => onSearchableDropdownChange('status', value)}
                options={STATUS}
                clearAllSelectedValues={() => setFilters((prev) => ({ ...prev, status: [] }))}
              />
              <div className="custom-date-range-picker">
                <DateRangePicker dateRange={filters.dateRange || []} onChange={handleOnDateRangeChange} size="lg" minDate={new Date('-1')} maxDate={new Date()} />
              </div>
            </div>
          </div>
        </ToggleUI>
      </div>
    </form>
  );
};

export default Filters;
