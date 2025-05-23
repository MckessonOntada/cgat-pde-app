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

      selectedValue.forEach((val) => {
        const exists = checkedAccounts.some((item) => item.value === val.value);
        if (val.isChecked && !exists) {
          _checkedOptions.push(val);
        }
        if (!val.isChecked && exists) {
          _checkedOptions = _checkedOptions.filter((i) => i.value !== val.value);
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
