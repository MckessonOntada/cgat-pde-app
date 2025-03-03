import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@mckesson/mcp-component-library';
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
  const {
    selectedAccount,
    searchPayToAccounts,
    payToAccountsList,
    applyEvent,
    defaultSetEvent,
    defaultPayToAccount,
    payToAccountsData,
    setSelectedAccountRaw,
    totalAccounts
  } = useAccountContext();
  const [selectedPayToAccount, setSelectedPayToAccount] = useState(null);

  const [isValueSelected, setIsValueSelected] = useState(false);
  const [isCurrentDefault, setIsCurrentDefault] = useState(false);

  useEffect(() => {
    if (selectedAccount)
      setSelectedPayToAccount({
        label: `(${selectedAccount.accountNumber}) ${selectedAccount.accountName}`,
        labelDescription: GeographicUtils.addressAggregator(selectedAccount),
        value: selectedAccount.id
      });
  }, []);

  const options = useMemo(() => {
    let _options = [...[], ...payToAccountsList];
    if (selectedPayToAccount) {
      let findOrg = _options.find((item) => item.value == selectedPayToAccount.value);
      !findOrg &&
        _options.unshift({
          index: 0,
          label: `(${selectedAccount.accountNumber}) ${selectedAccount.accountName}`,
          labelDescription: GeographicUtils.addressAggregator(selectedAccount),
          value: selectedAccount.id
        });
    }
    return payToAccountsList;
  }, [payToAccountsList]);

  const onApplyClick = () => {
    if (CommonUtils.isNonEmptyObject(selectedPayToAccount)) {
      applyEvent(selectedPayToAccount.value);
      navigate(PATHS.invoices);
      setIsCurrentDefault(true);
      setIsValueSelected(false);
    }
  };

  const onDefaultSetClick = () => {
    CommonUtils.isNonEmptyObject(selectedPayToAccount) && defaultSetEvent(selectedPayToAccount.value);

    setIsCurrentDefault(!isCurrentDefault);
  };

  const getSelectedValueData = (selectedValue) => {
    let _selected = payToAccountsList.find((ele) => ele.value == selectedValue);
    setSelectedPayToAccount(_selected);

    let _selectedRaw = payToAccountsData.find((ele) => ele.id == selectedValue);
    setSelectedAccountRaw(_selectedRaw);

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
            <MultiSelectDropdown
              id={'pay-to-accounts-search'}
              label={' '}
              isMultiSelect={false}
              placeholder={'Select Account'}
              onChange={getSelectedValueData}
              options={options}
              variant={'async'}
              onSearch={(event) => searchPayToAccounts(event)}
              recordsCountToEnableSearch={5}
              size="lg"
              value={CommonUtils.isNonEmptyObject(selectedPayToAccount) ? selectedPayToAccount?.value : ''}
              fieldDisplayValue={CommonUtils.isNonEmptyObject(selectedPayToAccount) ? selectedPayToAccount : undefined}
              refineFilterMessage={['More records exist.', 'Search to refine.']}
              asyncRecordsFound={totalAccounts}
            />
          </div>
          <div className="search-form-actions">
            <Button
              className="apply-button"
              variant={'secondary'}
              size={buttonSize}
              onClick={onApplyClick}
              disabled={
                !CommonUtils.isNonEmptyObject(selectedAccount) || !isValueSelected || !CommonUtils.isNonEmptyArray(payToAccountsList)
              }>
              {t('paymentInvoices.accountSearch.applyBtn')}
            </Button>
            <Button
              className="set-as-default-button"
              variant={'secondary'}
              size={buttonSize}
              onClick={onDefaultSetClick}
              disabled={
                !CommonUtils.isNonEmptyObject(selectedAccount) || defaultPayToAccount?.id === selectedAccount?.id || !isCurrentDefault
              }>
              {t('paymentInvoices.accountSearch.setAsDefaultBtn')}
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  ) : null;
}
