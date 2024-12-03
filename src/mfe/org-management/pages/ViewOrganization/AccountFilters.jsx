import React, { useState } from 'react';
import { AutoSuggestSearch, Button, Divider, SearchableDropdown, InputField } from '@mckesson/mcp-component-library';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import { useOrgAccounts } from '../../context/OrgAccountsContext';

export default function AccountFilters(props) {
  const [expandedCard, setExpandedCard] = useState(false);
  const { data, pagination, refetch, filters } = useOrgAccounts();

  const handleExpandCard = () => {
    setExpandedCard((prevExpandedCard) => !prevExpandedCard);
  };

  const onSearchChange = (event) => {
    filters.update.setSearchQuery(event.target.value);
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
            <InputField errors={{}} id="search-box" name="firstName" value={filters.searchQuery} onInputChange={onSearchChange} tooltipText={null} useRegister={false} placeholder={''} />
          </div>
        </div>

        {<Button type="button" variant="secondary" label={'Apply Filter'} className="filter-btn" onClick={onApplyFilters} size="md" />}
      </div>
    </div>
  );
}
