import React, { useCallback } from 'react';
import { Button } from '@mckesson/mcp-component-library';
import AccountsList from '../../../../components/Accounts/AccountsList';
import './CreateOrg.scss';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '../../../../routes/constants';
import DetailsView from './DetailsView';

export default function OrgDetails({
  prevStepData,
  onEditClick,
  selectedAccounts,
  setSelectedAccounts
}) {
  const navigate = useNavigate();

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
        selectedRows={selectedAccounts}
        setSelectedRows={setSelectedAccounts}
        onRemoveAccount={onRemoveAccount}
        showSelectedAccounts
      />
      <div className="btn-box">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleCreateOrg}>Create organization</Button>
      </div>
    </div>
  );
}
