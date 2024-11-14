import React, { useCallback } from 'react';
import { Button } from '@mckesson/mcp-component-library';
import AccountsList from '../../components/AccountsList';
import './CreateOrg.scss';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@mckesson/mcp-component-library';
import { ReactComponent as delete_icon } from '@src/assets/image/delete.svg';
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
      <div className="account-box">
        <div>
          <AccountsList selectedRows={selectedAccounts} setSelectedRows={setSelectedAccounts} />
        </div>
        <div className="selected-accounts-display">
          <h2 className="selected-account-heading">Selected Account</h2>
          <Divider className="selected-account-divider" />

          {selectedAccounts && (
            <div className="selected-account-container">
              {selectedAccounts.map((item) => (
                <div key={item.id} className="selected-account">
                  <div>
                    <p className="selected-account-label">{item.name}</p>
                    <p className="selected-account-label">({item.id})</p>
                  </div>
                  <Button
                    Icon={delete_icon}
                    variant="tertiary"
                    iconButton={true}
                    onClick={() => onRemoveAccount(item)}
                    size="md"
                    className="delete-icon"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="btn-box">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleCreateOrg}>Create organization</Button>
      </div>
    </div>
  );
}
