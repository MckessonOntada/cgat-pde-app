import React, { useState } from 'react';
import { Button, Divider, InputField, AutoSuggestDropdown } from '@mckesson/mcp-component-library';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import { useOrgAccounts } from '../../context/OrgAccountsContext';
import ToggleUI from '@src/components/toggleui';

const salesOrgOptions = [
  { label: 'so36', value: 'so36' },
  { label: 'so37', value: 'so37' },
  { label: 'so38', value: 'so38' }
];
const distributionChannelOptions = [{ label: 'dc', value: 'dc' }];

export default function AccountFilters(props) {
  const [expandedCard, setExpandedCard] = useState(false);
  const { data, pagination, refetch, filters } = useOrgAccounts();

  const handleExpandCard = () => {
    setExpandedCard((prevExpandedCard) => !prevExpandedCard);
  };

  const onSearchChange = (event) => {
    filters.update.setSearchQuery(event.target.value);
  };

  const handleChangeAutoSuggest = (name, event) => {
    filters.update.updateQuery(name, event.value);
  };

  const onApplyFilters = () => {
    refetch();
  };

  return (
    <div className="filterBox line-height">
      <div className="toggle-container">
        <div className="toggle-box">
          <div onClick={handleExpandCard}>
            <img src={expandedCard ? arrow_down : arrow_right} className="icon-align" alt="toggle-icon" />
          </div>
          <div className="autoSuggestSearch-container">
            <InputField errors={{}} id="search-box" name="searchQuery" value={filters.searchQuery} onInputChange={onSearchChange} tooltipText={null} useRegister={false} placeholder={''} />
          </div>
        </div>

        {expandedCard && <Button type="button" variant="secondary" label={'Apply Filter'} className="filter-btn" onClick={onApplyFilters} size="md" />}
      </div>
      <ToggleUI in={expandedCard} timeout={400}>
        <div className="expanded-content">
          <Divider color={'var(--brand-color-grey-scale-cool-1)'} />
          <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
            <AutoSuggestDropdown eregVariant getselectedValue={(e) => handleChangeAutoSuggest('salesOrg', e)} onChangeInput={() => {}} label={'Sales Org'} selectedVal={filters.salesOrg} key={'salesOrg'} suggestionList={salesOrgOptions} />
            <AutoSuggestDropdown eregVariant getselectedValue={(e) => handleChangeAutoSuggest('distributionChannel', e)} onChangeInput={() => {}} label={'Distribution Channel'} selectedVal={''} key={'dc_Filter'} suggestionList={distributionChannelOptions} />
            <div className="LabelBox">{<Button type="button" label="Clear filter" textButton className="txtbtn" onClick={() => filters.clearFilters()} />}</div>
          </div>
        </div>
      </ToggleUI>
    </div>
  );
}
