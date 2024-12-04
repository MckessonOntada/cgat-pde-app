import React, { useState } from 'react';
import { Button, Divider, InputField, AutoSuggestDropdown } from '@mckesson/mcp-component-library';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import { useOrgAccounts } from '../../context/OrgAccountsContext';
import ToggleUI from '@src/components/toggleui';
import { useTranslate } from '@src/translations/useTranslation';
import CommonUtils from '@src/util/CommonUtils';

const salesOrgOptions = [
  { label: 'so36', value: 'so36' },
  { label: 'so37', value: 'so37' },
  { label: 'so38', value: 'so38' }
];
const distributionChannelOptions = [{ label: 'dc', value: 'dc' }];
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
    // filters.update.updateQuery(name, event.value);
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
              <InputField errors={{}} id="search-box" name="searchQuery" value={filters.searchQuery} onInputChange={(e) => handleChangeAutoSuggest('searchQuery', e.target.value)} tooltipText={null} useRegister={false} placeholder={t('account.no')} />
            </div>
          </div>
          {controlButtons}
        </div>
        <ToggleUI in={isCardExpanded} timeout={400}>
          <div className="additional-filters">
            <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
              <AutoSuggestDropdown eregVariant getselectedValue={(e) => handleChangeAutoSuggest('salesOrg', e.value)} onChangeInput={() => {}} label={'Sales Org'} selectedVal={filters.salesOrg} key={'salesOrg'} suggestionList={salesOrgOptions} />
              <AutoSuggestDropdown eregVariant getselectedValue={(e) => handleChangeAutoSuggest('distributionChannel', e.value)} onChangeInput={() => {}} label={'Distribution Channel'} selectedVal={''} key={'dc_Filter'} suggestionList={distributionChannelOptions} />
              {/* {isCardExpanded && controlButtons ? <div className="expanded">{controlButtons}</div> : null} */}
            </div>
          </div>
        </ToggleUI>
      </div>
    </form>
  );
}
