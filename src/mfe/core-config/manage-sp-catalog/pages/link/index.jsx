import ModuleHeader from '@src/components/module-header';
import React, { useEffect, useMemo, useRef } from 'react';
import { Button, Heading, Alert } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';

import useTimedArray from '@src/mfe/order-management/pages/create/form-segments/summary/useTimedArray';
import { Route, useLocation, useNavigate } from 'react-router-dom';

import OrgAccountsMultiSelect from '../orgAccountMultiSelect';
import { useOrgAccountsMultiSelectionContext } from '../context/OrgAccountMultiselectContext';
import OrgAccountsSelect from '@src/mfe/order-management/components/orgAccountSelection/OrgAccountsSelect';
import { useOrgAccountSelectionContext } from '@src/mfe/order-management/components/orgAccountSelection/context/OrgAccountSelectionContext';
import { useSPMaterial } from '@src/mfe/order-management/pages/system-configuration/manage-spmaterial/context/SPMaterialContext';

import CommonFilters from '@src/components/Filters';
import SPMaterialDataTable from '@src/mfe/order-management/pages/system-configuration/manage-spmaterial/pages/SPMaterialDataTable';

import { ReactComponent as IconArrowLeft } from '@src/assets/svg/arrow-left.svg';

const LinkSPMaterial = () => {
  const { t } = useTranslate();
  const navigate = useNavigate();
  const location = useLocation();
  const { items: notifications, add: addNotification, remove: removeNotification } = useTimedArray(10000);
  const { applyFilters, clearFilters, selectedSPMaterial } = useSPMaterial();
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
  const lastAccountOptionsRef = useRef(accountOptions);
  // useEffect(() => {
  //   const hydratedOrg =
  //     selectedOrganization?.length === 0 && location.state?.selectedOrganization
  //       ? location.state.selectedOrganization
  //       : selectedOrganization;

  //   const hydratedAcc =
  //     selectedAccount?.length === 0 && location.state?.selectedAccount
  //       ? location.state.selectedAccount
  //       : selectedAccount?.map((account) => {
  //           const matchingStateAccount = location.state?.selectedAccount?.find(
  //             (stateAcc) => stateAcc.accountNumber === account.accountNumber
  //           );

  //           return matchingStateAccount ? { ...account, isChecked: matchingStateAccount.isChecked } : account;
  //         });

  //   if (selectedOrganization?.length === 0 && hydratedOrg?.length > 0) {
  //     setSelectedOrganization(hydratedOrg);
  //   }

  //   if (selectedAccount?.length === 0 && hydratedAcc?.length > 0) {
  //     setSelectedAccount(hydratedAcc);
  //   }

  //   if (hydratedOrg?.length > 0 && options.length > 0) {
  //     const updatedOptions = options.map((opt) => ({
  //       ...opt,
  //       isChecked: hydratedOrg.some((org) => org.value === opt.value)
  //     }));

  //     if (JSON.stringify(updatedOptions) !== JSON.stringify(options)) {
  //       setOptions(updatedOptions);
  //     }
  //   }

  //   if (hydratedAcc?.length > 0 && accountOptions.length > 0) {
  //     const updatedAccountOptions = accountOptions.map((opt) => {
  //       const matchingAccount = hydratedAcc.find((account) => account.value === opt.value);
  //       return {
  //         ...opt,
  //         isChecked: matchingAccount ? matchingAccount.isChecked || opt.isChecked : opt.isChecked
  //       };
  //     });

  //     if (JSON.stringify(updatedAccountOptions) !== JSON.stringify(lastAccountOptionsRef.current)) {
  //       setAccountOptions(updatedAccountOptions);
  //       lastAccountOptionsRef.current = updatedAccountOptions;
  //     }
  //   }
  // }, [location.state, options.length, accountOptions?.length, selectedAccount, selectedOrganization]);

  useEffect(() => {
    const hydratedOrg =
      selectedOrganization?.length === 0 && location.state?.selectedOrganization
        ? location.state.selectedOrganization
        : selectedOrganization;

    if (selectedOrganization?.length === 0 && hydratedOrg?.length > 0) {
      setSelectedOrganization(hydratedOrg);
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
  }, [location.state, options.length]);

  useEffect(() => {
    const hydratedAcc =
      selectedAccount?.length === 0 && location.state?.selectedAccount
        ? location.state.selectedAccount
        : selectedAccount?.map((account) => {
            const matchingStateAccount = location.state?.selectedAccount?.find(
              (stateAcc) => stateAcc.accountNumber === account.accountNumber
            );

            return matchingStateAccount ? { ...account, isChecked: matchingStateAccount.isChecked } : account;
          });

    if (selectedAccount?.length === 0 && hydratedAcc?.length > 0) {
      setSelectedAccount(hydratedAcc);
    }

    if (hydratedAcc?.length > 0 && accountOptions.length > 0) {
      const updatedAccountOptions = accountOptions.map((opt) => {
        const matchingAccount = hydratedAcc.find((account) => account.value === opt.value);
        return {
          ...opt,
          isChecked: matchingAccount ? matchingAccount.isChecked || opt.isChecked : opt.isChecked
        };
      });

      if (JSON.stringify(updatedAccountOptions) !== JSON.stringify(lastAccountOptionsRef.current)) {
        setAccountOptions(updatedAccountOptions);
        lastAccountOptionsRef.current = updatedAccountOptions;
      }
    }
  }, [location.state, accountOptions?.length]);

  const goBack = () => {
    navigate('..', {
      state: { isSuccess: true }
    });
  };

  const handleCancel = () => {
    navigate('..', { state: { selectedSPMaterial, selectedAccount, selectedOrganization } });
  };

  const handleSave = () => {
    if (selectedSPMaterial.length === 0) {
      addNotification({
        type: 'error',
        description: t('SPCatalog.error.RequiredMissing')
      });
      return;
    }
    navigate('../review-catalog', { state: { selectedSPMaterial, selectedAccount, selectedOrganization } });
  };

  return (
    <div className="MCP-module-wrapper">
      <div>
        <Button className="back-button-control" variant="tertiary" Icon={() => <IconArrowLeft />} onClick={goBack} size="md">
          {t('SPCatalog.btnBack')}
        </Button>
      </div>

      <div className="MCP-module-body">
        <ModuleHeader heading={<Heading as="h1">{t('SPCatalog.LinkSPMaterial')}</Heading>} />
        {notifications?.length > 0 && (
          <div className="alert-container">
            <div className="MCP-module-body">
              {notifications.map((item, index) => (
                <Alert key={item.id} description={item.description} onClose={() => removeNotification(item.id)} type={item.type} />
              ))}
            </div>
          </div>
        )}
        <div className="MCP-panel-container">
          <div style={{ marginBottom: '8px' }}>
            <OrgAccountsMultiSelect />
          </div>
          <div class="MCP-panel-container">
            <CommonFilters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              additionalFilters={[]}
              searchPlaceholder={t('SPCatalog.Material.Placeholder')}
            />
          </div>
          <SPMaterialDataTable isLinkCatalog={true} />
          <div className={'buttonGroup'}>
            <Button variant="secondary" type="button" onClick={handleCancel} size={'md'}>
              {t('manageSPAccount.button.cancel')}
            </Button>

            <Button type="button" size={'md'} onClick={handleSave}>
              {t('SPCatalog.continue')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkSPMaterial;
