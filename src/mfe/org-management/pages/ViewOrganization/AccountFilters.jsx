import React, { useState } from 'react';
import { Button, Divider, InputField, AutoSuggestDropdown, Dropdown } from '@mckesson/mcp-component-library';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import { useOrgAccounts } from '../../context/OrgAccountsContext';
import ToggleUI from '@src/components/toggleui';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';

const salesOrgOptions = [
  { label: 'MPB', value: 8545 },
  { label: 'Speciality', value: 1000 },
  { label: '3PL', value: 1100 }
];
const distributionChannelOptions = [
  { label: '10', value: 10 },
  { label: '20', value: 20 },
  { label: '30', value: 30 },
  { label: '40', value: 40 },
  { label: '50', value: 50 },
  { label: '60', value: 60 }
];

const INITIAL_FILTER_STATE = {
  searchQuery: '',
  salesOrg: '',
  distributionChannel: '',
  pagination: {
    currentPage: 0,
    totalRecords: 0,
    totalPageCount: 0,
    recordsPerPage: 0
  }
};

export default function AccountFilters(props) {
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const { data, pagination, refetch, setFilterState, clearFilters } = useOrgAccounts();
  const [filters, setFilters] = React.useState(INITIAL_FILTER_STATE);
  const [appliedFilters, setAppliedFilters] = React.useState(INITIAL_FILTER_STATE);
  const { t } = useTranslate();

  const handleExpandCard = () => {
    setIsCardExpanded((prevExpandedCard) => !prevExpandedCard);
  };

  const handleChangeAutoSuggest = (name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleOnApplyFilter = (event) => {
    event.preventDefault();
    const updatedFilter = { ...filters };
    setAppliedFilters({ ...updatedFilter });
    setFilterState(updatedFilter);
  };
  const handleClearFilters = () => {
    setAppliedFilters(INITIAL_FILTER_STATE);
    setFilters(INITIAL_FILTER_STATE);
    clearFilters();
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
    <form onSubmit={handleOnApplyFilter}>
      <div className="MCP-filter-panel">
        <div className="filter-header">
          <div className="search-box">
            <button type="button" onClick={handleExpandCard}>
              <img src={isCardExpanded ? arrow_down : arrow_right} alt="toggle-icon" />
            </button>
            <div className={'ctrl-search-box'}>
              <InputField errors={{}} id="search-box" name="searchQuery" value={filters.searchQuery} onInputChange={(e) => handleChangeAutoSuggest('searchQuery', e.target.value)} tooltipText={null} useRegister={false} placeholder={t('account.filter.search')} />
            </div>
          </div>
          {controlButtons}
        </div>
        <ToggleUI in={isCardExpanded} timeout={400}>
          <div className="additional-filters">
            <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
              <Dropdown id="demo-dropdown" label={t('account.filter.salesOrg')} name="sales-org" onChange={(e) => handleChangeAutoSuggest('salesOrg', e)} options={salesOrgOptions || []} size="lg" value={filters.salesOrg} />
              <Dropdown id="demo-dropdown" label={t('account.filter.distributionChannel')} name="distribution-channel" onChange={(e) => handleChangeAutoSuggest('distributionChannel', e)} options={distributionChannelOptions || []} size="lg" value={filters.distributionChannel} />
            </div>
          </div>
        </ToggleUI>
      </div>
    </form>
  );
}
