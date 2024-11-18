import React, { useState, useEffect, useRef } from 'react';
import {
  AutoSuggestSearch,
  Button,
  Divider,
  SearchableDropdown,
  CustomDatepicker
} from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './index.scss';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';
import { debugIds, ID } from '@src/common/constants/id';

const Filters = ({ showRoleDropdown = false, showStatusDropdown = false }) => {
  const { t } = useTranslate();
  const [expandedCard, setExpandedCard] = useState(false);

  const handleExpandCard = () => {
    setExpandedCard(!expandedCard);
  };

 

  return (
    <div className="filterBox line-height" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
      {true ? (
        <>
          <div className="toggle-box">
            <div onClick={handleExpandCard}>
              {expandedCard ? (
                <img src={arrow_down} className="icon-align" />
              ) : (
                <img src={arrow_right} className="icon-align" />
              )}
            </div>
            <div className="autoSuggestSearch-container">
              <div className='auto-search' >

                <AutoSuggestSearch
                  label=" "
                  className="auto-search"
                  outline={true}
                  placeHolder={"Search by document number, sold to..."}
                />
              </div>
              {expandedCard && <Button
                type="button"
                label={t('filter')}
                className="filter-btn"
              />}
            </div>
          </div>
          <ToggleUI in={expandedCard} timeout={400}>
            <div className="expanded-content">
              <Divider color={'#BAC5CC'} />
              <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
                {showRoleDropdown && (
                  <SearchableDropdown
                    id="role"
                    isSuccess
                    label={"Payment Status"}
                    name={"Payment Status"}
                    isRequired={false}
                    options={[]}
                  />
                )}

                {(
                  <SearchableDropdown
                    id="status"
                    // isSuccess
                    label={"Payment Method"}
                    name={"Payment Method"}
                    isRequired={false}
                    options={[]}
                  />
                )}
                <CustomDatepicker
                  id="eventDate"
                  label="Start Date"
                  name="startDate"
                  onBlur={() => { }}
                  onChangeFn={{}}
                  onClickLeftArrow={() => { }}
                  onClickRightArrow={() => { }}
                  placeholder="Select a date"
                  value={null}
                  views={[
                    'year',
                    'month',
                    'day'
                  ]}
                />
                <CustomDatepicker
                  id="eventDate"
                  label="End Date"
                  name="endDate"
                  onBlur={() => { }}
                  onChangeFn={{}}
                  onClickLeftArrow={() => { }}
                  onClickRightArrow={() => { }}
                  placeholder="Select a date"
                  value={null}
                  views={[
                    'year',
                    'month',
                    'day'
                  ]}
                />

                <div className="LabelBox">
                  {(
                    <Button
                      type="button"
                      label={t('userManagement.clearFilter.label')}
                      textButton
                      className="txtbtn"
                    />
                  )}
                </div>
              </div>
            </div>
          </ToggleUI>
        </>
      ) : null}
    </div>
  );
};

export default Filters;
