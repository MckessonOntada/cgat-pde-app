import React, { useState, useEffect } from 'react';
import {
  AutoSuggestSearch,
  Button,
  Divider,
  SearchableDropdown
} from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';

const FilterPanel = ({ showLocationDropdown = false, showStatusDropdown = false }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { t } = useTranslate();
  const [expandedCard, setExpandedCard] = useState(false);
  const [isClearFiltersVisible, setIsClearFiltersVisible] = useState(false);

  const handleExpandCard = () => {
    setExpandedCard((prevExpandedCard) => !prevExpandedCard);
  };

  const handleSearch = (inputValue) => {
    setSearchQuery(inputValue);
  };

  useEffect(() => {
    setIsClearFiltersVisible(
      (searchQuery && searchQuery.length > 0) ||
      (location && location.length > 0) ||
      (status && status.length > 0)
    );
  }, [searchQuery, location, status]);

  const handleFilter = () => {
    alert(
      `Search Query: ${searchQuery}\nFiltered Location: ${JSON.stringify(
        location
      )}\nFiltered Status: ${JSON.stringify(status)}`
    );
  };

  const onSearchableDropdownChange = (type, value) => {
    const filteredValue = value.filter((item) => item.isChecked);
    if (type === 'location') {
      setLocation(filteredValue);
    }
    if (type === 'status') {
      setStatus(filteredValue);
    }
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <div>
      <div className="toggle-box">
        <div onClick={handleExpandCard}>
          <img
            src={expandedCard ? arrow_down : arrow_right}
            className="icon-align"
            alt="toggle-icon"
          />
        </div>
        <div className="autoSuggestSearch-container">
          <AutoSuggestSearch
            label=" "
            value={searchQuery}
            onChangeInput={handleSearch}
            outline={true}
            placeHolder={t('orgManagement.searchFilter.label')}
          />
        </div>
      </div>

      <ToggleUI in={expandedCard} timeout={400}>
        <div style={{display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px'}}>
          <Divider  />
          <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            <SearchableDropdown
              id="date_created"
              isSuccess
              value={location}
              label={t('orgManagement.role.labelDateCreated')}
              name={'date_created'}
              isRequired={false}
              onChange={(value) => {}}
              options={[]}
              clearAllSelectedValues={() => {}}
            />

            <div className="LabelBox">
              <Button
                type="button"
                label={t('orgManagement.button.filter')}
                className="filter-btn"
                onClick={handleFilter}
              />
              {isClearFiltersVisible && (
                <Button
                  type="button"
                  label={t('orgManagement.clearFilter.label')}
                  textButton
                  className="txtbtn"
                  onClick={handleClearFilters}
                />
              )}
            </div>
          </div>
        </div>
      </ToggleUI>
    </div>
  );
};

export default FilterPanel;
