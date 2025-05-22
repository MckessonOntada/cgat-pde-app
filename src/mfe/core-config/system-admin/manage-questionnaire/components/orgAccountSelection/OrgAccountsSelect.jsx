import React, { useEffect, useMemo, useState } from 'react';
import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';
import { useOrgAccountSelectionContext } from './context/OrgAccountSelectionContext';
import './styles.scss';
import { useTranslate } from '@src/translations/useTranslation';

function OrgAccountsSelect({ handleOrgChange, handleAccountChange, showAccountsSelect = true }) {
  const { t } = useTranslate();
  const {
    organizationOptions,
    searchOrgList,
    selectedOrganization,
    setSelectedOrganization,
    searchAccountList,
    setSelectedAccount,
    options,
    accountOptions,
    setAccountOptions,
    setCheckedAccounts,
    checkedAccounts,
    totalOrgs,
    totalAccs
  } = useOrgAccountSelectionContext();
  console.log('organizationOptions?.length', organizationOptions?.length);
  const onOrganizationChange = (selectedValue) => {
    let _selected = organizationOptions.find((ele) => ele.id == selectedValue);
    setSelectedOrganization(_selected);
    setCheckedAccounts([]);
    if (handleOrgChange) {
      handleOrgChange(_selected);
    }
  };

  const onAccountChange = (selectedValue) => {
    if (selectedValue.length > 0) {
      let _checkedOptions = [...[], ...checkedAccounts];
      selectedValue.map((ele) => {
        let eleExist = checkedAccounts.find((item) => item.value == ele.value);
        if (ele.isChecked) {
          if (!eleExist) _checkedOptions.push(ele);
        } else {
          if (eleExist) _checkedOptions = _checkedOptions.filter((i) => i.value != ele.value);
        }
      });
      setCheckedAccounts(_checkedOptions);
      setSelectedAccount(selectedValue);
      setAccountOptions(selectedValue);
    }
  };

  return (
    <div className="actions-container">
      <div className="org-select">
        <MultiSelectDropdown
          id={'select-org-search'}
          label={t('ManageCatalog.SelectOrganization')}
          isMultiSelect={false}
          placeholder={t('ManageCatalog.SelectOrganization')}
          onChange={onOrganizationChange}
          options={options}
          variant={'async'}
          onSearch={(event) => searchOrgList(event)}
          recordsCountToEnableSearch={5}
          size="md"
          isSortEnable={false}
          value={selectedOrganization?.id.toString() || ''}
          refineFilterMessage={[t('refineFilter.message')]}
          asyncRecordsFound={totalOrgs}
          fieldDisplayValue={
            selectedOrganization?.name
              ? {
                  label: selectedOrganization.name,
                  value: selectedOrganization.id.toString()
                }
              : undefined
          }
        />
      </div>
      {showAccountsSelect && (
        <div className="account-select">
          <MultiSelectDropdown
            id={'select-account-search'}
            label={t('ManageCatalog.SelectAccount')}
            isMultiSelect={true}
            placeholder={t('ManageCatalog.SelectAccount')}
            onChange={onAccountChange}
            options={accountOptions || []}
            variant={'async'}
            onSearch={(event) => searchAccountList(event)}
            recordsCountToEnableSearch={5}
            size="md"
            noSelectedCountMessage={t('ManageCatalog.SelectAccount')}
            refineFilterMessage={[t('refineFilter.message')]}
            asyncRecordsFound={totalAccs}
          />
        </div>
      )}
    </div>
  );
}
export default OrgAccountsSelect;
