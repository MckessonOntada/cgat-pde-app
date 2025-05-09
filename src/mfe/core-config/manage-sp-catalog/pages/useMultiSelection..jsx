import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useOrgAccountsMultiSelectionContext } from './context/OrgAccountMultiSelectContext';

export const useMultiSelectionfromState = () => {
  const location = useLocation();
  const {
    selectedAccount,
    selectedOrganization,
    setSelectedOrganization,
    setSelectedAccount,
    setOptions,
    setAccountOptions,
    options,
    accountOptions
  } = useOrgAccountsMultiSelectionContext();

  useEffect(() => {
    const hydratedOrg =
      selectedOrganization?.length === 0 && location.state?.selectedOrganization
        ? location.state.selectedOrganization
        : selectedOrganization;

    const hydratedAcc =
      selectedAccount?.length === 0 && location.state?.selectedAccount
        ? location.state.selectedAccount
        : selectedAccount?.map((account) => {
            const matchingStateAccount = location.state?.selectedAccount?.find(
              (stateAcc) => stateAcc.accountNumber === account.accountNumber
            );

            return matchingStateAccount ? { ...account, isChecked: matchingStateAccount.isChecked } : account;
          });

    if (selectedOrganization?.length === 0 && hydratedOrg?.length > 0) {
      setSelectedOrganization(hydratedOrg);
    }

    if (selectedAccount?.length === 0 && hydratedAcc?.length > 0) {
      setSelectedAccount(hydratedAcc);
    }

    if (hydratedOrg?.length > 0 && options.length > 0) {
      const updatedOptions = options.map((opt) => ({
        ...opt,
        isChecked: hydratedOrg.some((org) => org.value === opt.value)
      }));

      if (JSON.stringify(updatedOptions) !== JSON.stringify(options)) {
        setOptions(updatedOptions);
      }
    }

    if (hydratedAcc?.length > 0 && accountOptions.length > 0) {
      const updatedAccountOptions = accountOptions.map((opt) => {
        const matchingAccount = hydratedAcc.find((account) => account.value === opt.value);
        return {
          ...opt,
          isChecked: matchingAccount ? matchingAccount.isChecked || opt.isChecked : opt.isChecked
        };
      });

      const hasDifference = updatedAccountOptions.some((opt, index) => opt.isChecked !== accountOptions[index].isChecked);
      if (hasDifference) {
        setAccountOptions(updatedAccountOptions);
      }
    }
  }, [location.state, options.length, accountOptions?.length, selectedAccount, selectedOrganization]);
};
