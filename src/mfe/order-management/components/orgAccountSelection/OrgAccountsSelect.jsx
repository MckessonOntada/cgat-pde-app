import React, { useMemo, useState } from 'react';
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
    setSelectedAccount
  } = useOrgAccountSelectionContext();

  const orgOptions = useMemo(() => {
    let _options = [];
    _options =
      organizationOptions.map((item, index) => ({
        index,
        label: item.name,
        value: item.id
      })) || [];
    if (selectedOrganization) {
      let findOrg = _options.find((item) => item.value == selectedOrganization.id);
      !findOrg && _options.push({ label: selectedOrganization.name, value: selectedOrganization.id });
    }
    return _options;
  }, [organizationOptions]);

  const getSelectedOrg = (selectedValue) => {
    let _selected = organizationOptions.find((ele) => ele.id == selectedValue);
    setSelectedOrganization(_selected);
    if (handleOrgChange) {
      handleOrgChange(_selected);
    }
  };

  const accountOptions = useMemo(() => {
    return (
      accountsList.map((item, index) => ({
        index,
        label: item.accountName,
        value: item.id
      })) || []
    );
  }, [accountsList]);

  const getSelectedAccount = (selectedValue) => {
    let _selected = accountsList.find((ele) => ele.id == selectedValue);
    setSelectedAccount(_selected);
    if (handleAccountChange) {
      handleAccountChange(_selected);
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
          options={orgOptions}
          variant={'async'}
          onSearch={(event) => searchOrgList(event)}
          recordsCountToEnableSearch={5}
          size="md"
          value={selectedOrganization?.id || ''}
        />
      </div>
      {showAccountsSelect && (
        <div className="account-select">
          <MultiSelectDropdown
            id={'select-account-search'}
            label={'Select Account'}
            isMultiSelect={false}
            // placeholder={selectedOrganization?.label || 'Select Organization'}
            placeholder={'Select Account'}
            onChange={getSelectedAccount}
            options={accountOptions || []}
            variant={'async'}
            onSearch={(event) => searchAccountList(event)}
            recordsCountToEnableSearch={5}
            size="md"
            value={selectedAccount?.id || ''}
          />
        </div>
      )}
    </div>
  );
}
export default OrgAccountsSelect;
