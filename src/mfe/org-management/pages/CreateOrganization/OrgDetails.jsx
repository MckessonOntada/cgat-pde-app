import React, { useCallback } from 'react';
import { Button } from '@mckesson/mcp-component-library';
import AccountsList from '@src/components/Accounts/AccountsList';
import './CreateOrg.scss';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@src/routes/constants';
import DetailsView from '../../components/DetailsView';
import AllAccountsData from '../../mockData/AllAccounts';
import { useTranslate } from '@src/translations/useTranslation';

export default function OrgDetails({
  prevStepData,
  onEditClick,
  selectedAccounts,
  setSelectedAccounts
}) {
  const navigate = useNavigate();
  const { t } = useTranslate();
  const onRemoveAccount = useCallback(
    (item) => {
      setSelectedAccounts(selectedAccounts.filter((account) => account.id !== item.id));
    },
    [selectedAccounts, setSelectedAccounts]
  );

  const handleCreateOrg = () => {
    // Display an alert with prevStepData and selectedAccounts data
    navigate(RoutePaths.pathOrgManagement);
    alert(
      `Organization Details: ${JSON.stringify(
        prevStepData,
        null,
        2
      )}\n\nSelected Accounts: ${JSON.stringify(selectedAccounts, null, 2)}`
    );
  };

  const handleCancel = () => {};

  return (
    <div className="main-account-container">
      <div>
        <DetailsView data={prevStepData} onEditClick={onEditClick} />
      </div>
      <AccountsList
        data={AllAccountsData}
        selectedRows={selectedAccounts}
        setSelectedRows={setSelectedAccounts}
        onRemoveAccount={onRemoveAccount}
        showSelectedAccounts
        omitColumns={['action', 'cgatIdentifier', 'address']}
      />
      <div className="btn-box">
        <Button variant="secondary" onClick={handleCancel}>
          {t('orgManagement.button.cancel')}
        </Button>
        <Button onClick={handleCreateOrg}>{t('orgManagement.create_org')}</Button>
      </div>
    </div>
  );
}
