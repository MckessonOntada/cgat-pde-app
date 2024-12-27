import React, { useState } from 'react';
import { Button, AutoSuggestSearch } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import useWindowSize from '@src/hooks/UseWindowSize';
import { useAccountContext } from '../context/AccountContext';
import { GeographicUtils } from '@src/util/GeographicUtil';
import CommonUtils from '@src/util/CommonUtils';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../routes';
import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';

const TABLET_BREAKPOINT = 768;

export default function RecordDetails() {
  const { t } = useTranslate();
  const windowSize = useWindowSize();
  const isMobileView = windowSize.width < TABLET_BREAKPOINT;
  const buttonSize = isMobileView ? 'md' : 'lg';
  const navigate = useNavigate();
  const { selectedAccount, searchPayToAccounts, payToAccountsList, applyEvent, defaultSetEvent } = useAccountContext();
  const [selectedPayToAccount, setSelectedPayToAccount] = useState(null);

  const [isValueSelected, setIsValueSelected] = useState(false);

  const onApplyClick = () => {
    if (CommonUtils.isNonEmptyObject(selectedPayToAccount)) {
      applyEvent(selectedPayToAccount);
      navigate(PATHS.invoices);
    }
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
            {/* <AutoSuggestSearch
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
            /> */}
            <MultiSelectDropdown
              id={'pay-to-accounts-search'}
              label={' '}
              isMultiSelect={false}
              placeholder={'Select Account'}
              onChange={getSelectedValueData}
              options={payToAccountsList}
              variant={'async'}
              onSearch={(event) => searchPayToAccounts(event)}
              recordsCountToEnableSearch={5}
              size="lg"
              value={CommonUtils.isNonEmptyObject(selectedAccount) ? selectedAccount?.id : ''}
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
                !CommonUtils.isNonEmptyArray(payToAccountsList)
              }
            >
              {t('paymentInvoices.accountSearch.applyBtn')}
            </Button>
            <Button
              className="set-as-default-button"
              variant={'secondary'}
              size={buttonSize}
              onClick={onDefaultSetClick}
              disabled={!CommonUtils.isNonEmptyObject(selectedAccount) || !isValueSelected}
            >
              {t('paymentInvoices.accountSearch.setAsDefaultBtn')}
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  ) : null;
}
