import React, { useCallback } from 'react';
import { Button } from '@mckesson/mcp-component-library';
import AccountsList from '../../components/AccountsList';
import './CreateOrg.scss';
import OrgDetails from './OrgDetails';

export default function CreateOrgStep2({
  prevStepData,
  onEditClick,
  selectedAccounts,
  setSelectedAccounts
}) {
  const onRemoveAccount = useCallback((item) => {
    setSelectedAccounts(selectedAccounts.filter((account) => account.id !== item.id));
  }, []);

  return (
    <div className='main-account-container'>
      <div>
        <OrgDetails data={prevStepData} onEditClick={onEditClick} />
      </div>
      <div>
        <AccountsList selectedRows={selectedAccounts} setSelectedRows={setSelectedAccounts} />
      </div>
      <div>
        {selectedAccounts &&
          selectedAccounts.map((item) => (
            <div className="selected-account">
              {item.name}
              <Button onClick={() => onRemoveAccount(item)}>Remove</Button>
            </div>
          ))}
      </div>
    </div>
  );
}
