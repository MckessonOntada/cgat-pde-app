import React, { useCallback } from 'react';
import { Button } from '@mckesson/mcp-component-library';
import AccountsList from '../../components/AccountsList';
import './CreateOrg.scss';
import OrgDetails from './OrgDetails';
import { Divider } from '@mckesson/mcp-component-library';
import { ReactComponent as delete_icon } from '@src/assets/image/delete.svg';

export default function CreateOrgStep2({
  prevStepData,
  onEditClick,
  selectedAccounts,
  setSelectedAccounts
}) {
  // Function to remove an account from selectedAccounts by its id
  const onRemoveAccount = useCallback(
    (item) => {
      setSelectedAccounts(selectedAccounts.filter((account) => account.id !== item.id));
    },
    [selectedAccounts, setSelectedAccounts]
  );

  const handleCreateOrg = () => {
    // Display an alert with prevStepData and selectedAccounts data
    alert(
      `Organization Details: ${JSON.stringify(
        prevStepData,
        null,
        2
      )}\n\nSelected Accounts: ${JSON.stringify(selectedAccounts, null, 2)}`
    );
  };

  return (
    <div className="main-account-container">
      <div>
        <OrgDetails data={prevStepData} onEditClick={onEditClick} />
      </div>
      <div className="account-box">
        <div>
          <AccountsList selectedRows={selectedAccounts} setSelectedRows={setSelectedAccounts} />
        </div>
        <div className="selected-accounts-display">
          <h2 className="selected-account-heading ">Selected Account</h2>
          <Divider className="selected-account-divider" />

          {selectedAccounts && (
            <div className="selected-account-container">
              {selectedAccounts.map((item) => (
                <div key={item.id} className="selected-account">
                  <div>
                    <p className="selected-account-label ">{item.name}</p>
                    <p className="selected-account-label ">({item.id})</p>
                  </div>
                  <Button
                    Icon={delete_icon}
                    variant="tertiary"
                    iconButton={true}
                    onClick={() => onRemoveAccount(item)}
                    size={'md'}
                    className="delete-icon"
                  />
                </div>
              ))}
              ;
            </div>
          )}
        </div>
      </div>

      <div className="btn-box">
        <Button variant="secondary">cancel</Button>
        <Button onClick={handleCreateOrg}>Create organization</Button>
      </div>
    </div>
  );
}
