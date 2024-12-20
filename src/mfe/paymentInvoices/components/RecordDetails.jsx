import React, { useState } from 'react';
import { Button, AutoSuggestSearch } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import useWindowSize from '@src/hooks/UseWindowSize';
import { useAccountContext } from '../context/AccountContext';
import { GeographicUtils } from '@src/util/GeographicUtil';
import CommonUtils from '@src/util/CommonUtils';

const TABLET_BREAKPOINT = 768;

export default function RecordDetails() {
  const { t } = useTranslate();
  const windowSize = useWindowSize();
  const isMobileView = windowSize.width < TABLET_BREAKPOINT;
  const buttonSize = isMobileView ? 'md' : 'lg';

  const { selectedAccount, searchPayToAccounts, payToAccountsList, applyEvent, searchText, defaultSetEvent } = useAccountContext();
  const [selectedPayToAccount, setSelectedPayToAccount] = useState(null);

  const [isValueSelected, setIsValueSelected] = useState(false);

  const onApplyClick = () => {
    CommonUtils.isNonEmptyObject(selectedPayToAccount) && applyEvent(selectedPayToAccount);
  };

  const onDefaultSetClick = () => {
    CommonUtils.isNonEmptyObject(selectedPayToAccount) && defaultSetEvent(selectedPayToAccount);
  };

  const getSelectedValueData = (selectedValue) => {
    setSelectedPayToAccount(selectedValue);
    setIsValueSelected(true);
  };

  return CommonUtils.isNonEmptyObject(selectedAccount) ? (
    <React.Fragment>
      <div className="card-container">
        <div className="account-info">
          <div className="account-name">
            {CommonUtils.isNonEmptyString(selectedAccount?.accountName) ? selectedAccount?.accountName : ''}
          </div>
          <div className="account-address">{selectedAccount ? GeographicUtils.addressAggregator(selectedAccount) : ''}</div>
        </div>
        <div className="account-search">
          <div className="search-form">
            <AutoSuggestSearch
              id="pay-to-accounts-search"
              size="lg"
              outline={true}
              suggestionList={payToAccountsList}
              onChangeInput={(event) => searchPayToAccounts(event)}
              getSelectedValueData={getSelectedValueData}
              searchValue={
                CommonUtils.isNonEmptyObject(selectedAccount) ? `(${selectedAccount?.accountNumber}) ${selectedAccount?.accountName}` : ''
              }
              setValue={true}
            />
          </div>
          <div className="search-form-actions">
            <Button
              className="apply-button"
              variant={'secondary'}
              size={buttonSize}
              onClick={onApplyClick}
              disabled={
                !CommonUtils.isNonEmptyObject(selectedAccount) ||
                !isValueSelected ||
                !CommonUtils.isNonEmptyString(searchText) ||
                !CommonUtils.isNonEmptyArray(payToAccountsList)
              }>
              {t('paymentInvoices.accountSearch.applyBtn')}
            </Button>
            <Button
              className="set-as-default-button"
              variant={'secondary'}
              size={buttonSize}
              onClick={onDefaultSetClick}
              disabled={!CommonUtils.isNonEmptyObject(selectedAccount) || !isValueSelected}>
              {t('paymentInvoices.accountSearch.setAsDefaultBtn')}
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  ) : null;
}
