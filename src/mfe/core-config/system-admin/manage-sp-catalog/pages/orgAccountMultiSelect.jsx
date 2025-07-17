import React, { useCallback } from 'react';
import MultiSelectDropdown from '@src/components/form/MultiSelectDropdown';
import { useTranslate } from '@src/translations/useTranslation';
import { useOrgAccountsMultiSelectionContext } from './context/OrgAccountMultiSelectContext';
import './styles.scss';
function OrgAccountsMultiSelect({ handleOrgChange, handleAccountChange, isSelect = false }) {
  const { t } = useTranslate();
  const {
    searchOrgList,
    selectedOrganization,
    setSelectedOrganization,
    searchAccountList,
    setSelectedAccount,
    options,
    setOptions,
    accountOptions,
    setAccountOptions,
    setCheckedAccounts,
    checkedAccounts,
    totalOrgs,
    totalAccs,
    setCheckedOrganizations
  } = useOrgAccountsMultiSelectionContext();

  const onOrganizationChange = async (selectedValue) => {
    if (!Array.isArray(selectedValue)) {
      return;
    }
    const _selected = selectedValue.filter((item) => item.isChecked);

    setCheckedOrganizations(_selected);
    setSelectedOrganization((prev) => {
      if (!Array.isArray(prev)) {
        return [];
      }
      const unselectedOrgs = prev.filter((org) => !_selected.some((sel) => sel.value === org.value));
      unselectedOrgs.forEach((org) => {
        setCheckedAccounts((prev) => {
          if (!Array.isArray(prev)) {
            return [];
          }
          return prev.filter((acc) => acc.practiceId !== org.value);
        });
      });
      return _selected;
    });
    if (_selected.length > 0) {
      setOptions((prevOptions) => {
        const updatedOptions = prevOptions.map((opt) => {
          const isChecked = _selected.some((org) => org.value === opt.value);
          if (opt.isChecked !== isChecked) {
            return { ...opt, isChecked };
          }
          return opt;
        });

        const isDifferent = updatedOptions.some((opt, idx) => {
          return opt.isChecked !== prevOptions[idx].isChecked;
        });

        if (isDifferent) {
          return updatedOptions;
        }

        return prevOptions;
      });
    } else {
      setCheckedAccounts([]);
      setSelectedAccount([]);
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
      setSelectedAccount(_checkedOptions);
      setAccountOptions(selectedValue);
    }
  };

  return (
    <div className="actions-container">
      <div className="org-select">
        <MultiSelectDropdown
          id={'select-org-search'}
          label={t('ManageCatalog.SelectOrganization')}
          isMultiSelect={true}
          placeholder={t('ManageCatalog.SelectOrganization')}
          onChange={onOrganizationChange}
          options={options}
          variant={'async'}
          onSearch={(event) => searchOrgList(event)}
          recordsCountToEnableSearch={5}
          size="md"
          isSortEnable={false}
          noSelectedCountMessage={t(isSelect ? 'forms.labels.organization' : 'ALL')}
          refineFilterMessage={[t('refineFilter.message')]}
          asyncRecordsFound={totalOrgs}
          clearAllSelectedValues={() => {
            setSelectedOrganization([]);
            setSelectedAccount([]);
          }}
        />
      </div>

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
          noSelectedCountMessage={t(isSelect ? 'ManageCatalog.SelectAccount' : 'ALL')}
          refineFilterMessage={[t('refineFilter.message')]}
          asyncRecordsFound={totalAccs}
        />
      </div>
    </div>
  );
}
export default OrgAccountsMultiSelect;
