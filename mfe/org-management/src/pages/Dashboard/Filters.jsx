import React, { useState } from 'react';
import { useOrg } from '../../context/PageContext';
import { AutoSuggestSearch, Button, Divider, SearchableDropdown } from '@mckesson/mcp-component-library';
import { LOCATIONS, STATUS } from '../../mockData/orgData';
import { Card } from '@mckesson/mcp-component-library';
// import "./index.scss";
import { useTranslation } from 'react-i18next';

const Filters = () => {
  const { t } = useTranslation();
  const [expandedCard, setExpandedCard] = useState(null);

  const handleExpandCard = cardId => {
    setExpandedCard(prevExpandedCard => (prevExpandedCard === cardId ? null : cardId));
  };

  const {
    filters: {
      searchQuery,
      location,
      update: { setLocation, setStatus, setSearchQuery },
      status,
      clearFilters,
    },
  } = useOrg();

  const handleSearch = inputValue => {
    setSearchQuery(inputValue);
  };

  const onSearchableDropdownChange = (type, value) => {
    const filteredValue = value.filter(item => item.isChecked);
    if (type === 'location') {
      setLocation(filteredValue);
    }
    if (type === 'status') {
      setStatus(filteredValue);
    }
  };

  const handleClear = () => {
    clearFilters();
  };

  return (
    <Card
      header={
        <AutoSuggestSearch
          label=" "
          value={searchQuery}
          onChangeInput={handleSearch}
          outline={true}
          placeHolder={t('select_name_location')}
        />
      }
      type="accordion"
      currentExpandedCard={expandedCard}
      onExpandCard={handleExpandCard}
      bodyContent={
        <div className="filterBox">
          <Divider />
          <div className="grid grid-gap-16 grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
            <SearchableDropdown
              id="location"
              isSuccess
              value={location}
              label={t('location')}
              name={t('location')}
              isRequired={false}
              onChange={value => onSearchableDropdownChange('location', value)}
              options={LOCATIONS}
              clearAllSelectedValues={() => setLocation([])}
            />

            <SearchableDropdown
              id="status"
              isSuccess
              value={status}
              label={t('status')}
              name={t('status')}
              isRequired={false}
              onChange={value => onSearchableDropdownChange('status', value)}
              options={STATUS}
              clearAllSelectedValues={() => setStatus([])}
            />

            <div className="LabelBox">
              <Button type="button" textButton className="clearfilterbtn" onClick={handleClear}>
                {t('clear_filters')}
              </Button>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Filters;
