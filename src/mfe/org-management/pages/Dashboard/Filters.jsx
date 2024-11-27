import React, { useState, useEffect } from 'react';
import { useOrg } from '../../context/OrgContext';
import {
  AutoSuggestSearch,
  Button,
  Divider,
  SearchableDropdown
} from '@mckesson/mcp-component-library';
import { LOCATIONS, STATUS } from '../../mockData/orgData';
import { useTranslate } from '@src/translations/useTranslation';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import { debugIds, ID } from '@src/constants/id';
import './index.scss';

const Filters = ({ showLocationDropdown = false, showStatusDropdown = false }) => {
  const { t } = useTranslate();
  const [expandedCard, setExpandedCard] = useState(false);
  const [isClearFiltersVisible, setIsClearFiltersVisible] = useState(false);

  const handleExpandCard = () => {
    setExpandedCard((prevExpandedCard) => !prevExpandedCard);
  };

  const {
    filters: {
      searchQuery,
      location,
      update: { setLocation, setStatus, setSearchQuery },
      status,
      clearFilters
    }
  } = useOrg();

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
    // alert(
    //   `Search Query: ${searchQuery}\nFiltered Location: ${JSON.stringify(
    //     location
    //   )}\nFiltered Status: ${JSON.stringify(status)}`
    // );
    // Add filter application logic here
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
    <div className="filterBox line-height" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
      {(showLocationDropdown || showStatusDropdown) && (
        <>
          <div className="toggle-container">
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

            {expandedCard && (
              <Button
                type="button"
                variant="secondary"
                label={t('orgManagement.button.filter')}
                className="filter-btn"
                onClick={handleFilter}
                size="md"
              />
            )}
          </div>
          <ToggleUI in={expandedCard} timeout={400}>
            <div className="expanded-content">
              <Divider />
              <div className="grid grid-gap-24 grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {showLocationDropdown && (
                  <SearchableDropdown
                    id="location"
                    isSuccess
                    value={location}
                    label={t('orgManagement.table.location')}
                    name={t('orgManagement.table.location')}
                    isRequired={false}
                    onChange={(value) => onSearchableDropdownChange('location', value)}
                    options={LOCATIONS}
                    clearAllSelectedValues={() => setLocation([])}
                  />
                )}

                {showStatusDropdown && (
                  <SearchableDropdown
                    id="status"
                    isSuccess
                    value={status}
                    label={t('orgManagement.table.status')}
                    name={t('orgManagement.table.status')}
                    isRequired={false}
                    onChange={(value) => onSearchableDropdownChange('status', value)}
                    options={STATUS}
                    clearAllSelectedValues={() => setStatus([])}
                  />
                )}

                {isClearFiltersVisible && (
                  <div className="LabelBox">
                    <Button
                      type="button"
                      label={t('orgManagement.clearFilter.label')}
                      textButton
                      className="txtbtn"
                      onClick={handleClearFilters}
                    />
                  </div>
                )}
              </div>
            </div>
          </ToggleUI>
        </>
      )}
    </div>
  );
};

export default Filters;
