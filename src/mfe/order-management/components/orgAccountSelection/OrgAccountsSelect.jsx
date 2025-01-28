import React, { useEffect, useMemo, useState } from 'react';
import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';
import { useOrgAccountSelectionContext } from './context/OrgAccountSelectionContext';
import './styles.scss';

function OrgAccountsSelect({ handleOrgChange, handleAccountChange, showAccountsSelect = true }) {
  const {
    organizationOptions,
    searchOrgList,
    selectedOrganization,
    setSelectedOrganization,
    accountsList,
    searchAccountList,
    selectedAccount,
    setSelectedAccount,
    options,
    setOptions,
    accountOptions,
    setAccountOptions
  } = useOrgAccountSelectionContext();

  const getSelectedOrg = (selectedValue) => {
    let _selected = organizationOptions.find((ele) => ele.id == selectedValue);
    setSelectedOrganization(_selected);
    if (handleOrgChange) {
      handleOrgChange(_selected);
    }
  };

  // const accountOptions = useMemo(() => {
  //   return accountsList.map((item, index) => ({ ...item, label: item.accountName, value: item.accountNumber, isChecked: true })) || [];
  // }, [accountsList]);

  const getSelectedAccount = (selectedValue) => {
    if (selectedValue.length > 0) {
      setSelectedAccount(selectedValue);
      setAccountOptions(selectedValue);
    }
  };

  return (
    <div className="actions-container">
      <div className="org-select">
        <MultiSelectDropdown
          id={'select-org-search'}
          label={'Select organization'}
          isMultiSelect={false}
          // placeholder={selectedOrganization?.name || 'Select Organization'}
          placeholder={'Select Organization'}
          onChange={getSelectedOrg}
          options={options}
          variant={'async'}
          onSearch={(event) => searchOrgList(event)}
          recordsCountToEnableSearch={5}
          size="md"
          isSortEnable={false}
          // size="md"
          value={selectedOrganization?.id.toString() || ''}
          fieldDisplayValue={
            selectedOrganization?.name ? { label: selectedOrganization.name, value: selectedOrganization.id.toString() } : undefined
          }
        />
      </div>
      {showAccountsSelect && (
        <div className="account-select">
          <MultiSelectDropdown
            id={'select-account-search'}
            label={'Select Account'}
            isMultiSelect={true}
            placeholder={'Select Account'}
            onChange={getSelectedAccount}
            options={accountOptions || []}
            variant={'async'}
            onSearch={(event) => searchAccountList(event)}
            recordsCountToEnableSearch={5}
            size="md"
            // value={selectedAccount || ''}
          />
        </div>
      )}
    </div>
  );
}
export default OrgAccountsSelect;
