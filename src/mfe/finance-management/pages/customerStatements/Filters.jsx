import React, { useState } from 'react';
import { AutoSuggestSearch, Button, Divider, CustomDatepicker } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './index.scss';
import arrow_right from '@src/assets/image/arrow_right.svg';
import arrow_down from '@src/assets/image/arrow_down.svg';
import ToggleUI from '@src/components/toggleui';

const Filters = ({ showRoleDropdown = false, showStatusDropdown = false }) => {
  const { t } = useTranslate();
  const [expandedCard, setExpandedCard] = useState(false);

  const handleExpandCard = () => {
    setExpandedCard(!expandedCard);
  };

  return (
    <div>
      <div className="toggle-box">
        <div onClick={handleExpandCard}>
          {expandedCard ? <img src={arrow_down} className="icon-align" /> : <img src={arrow_right} className="icon-align" />}
        </div>
        <div className="autoSuggestSearch-container">
          <div className="auto-search">
            <AutoSuggestSearch label=" " className="auto-search" outline={true} placeHolder={t('paymentInvoices.CS.filters.autoSearch')} />
          </div>
          {expandedCard && (
            <Button
              type="button"
              label={t('paymentInvoices.CS.filters.filterBtn')}
              className="filter-btn"
              variant="secondary"
              onClick={() => {}}
              size="md"
            />
          )}
        </div>
      </div>
      <ToggleUI in={expandedCard} timeout={400}>
        <div className="expanded-content">
          <Divider color={'var(--brand-color-grey-scale-cool-1)'} />
          <div className="grid grid-gap-24 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
            <CustomDatepicker
              id="eventDate"
              label={t('paymentInvoices.CS.filters.startDate')}
              name="startDate"
              onBlur={() => {}}
              onChangeFn={{}}
              onClickLeftArrow={() => {}}
              onClickRightArrow={() => {}}
              placeholder="Select a date"
              value={null}
              views={['year', 'month', 'day']}
            />
            <CustomDatepicker
              id="eventDate"
              label={t('paymentInvoices.CS.filters.endDate')}
              name="endDate"
              onBlur={() => {}}
              onChangeFn={{}}
              onClickLeftArrow={() => {}}
              onClickRightArrow={() => {}}
              placeholder="Select a date"
              value={null}
              views={['year', 'month', 'day']}
            />
            <div className="LabelBox">
              {<Button type="button" label={t('paymentInvoices.CS.filters.clearFilter')} textButton className="txtbtn" />}
            </div>
          </div>
        </div>
      </ToggleUI>
    </div>
  );
};

export default Filters;
