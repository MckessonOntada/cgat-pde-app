import React from 'react';
import { ReactComponent as DeleteIcon } from '@src/assets/image/delete.svg';
import { Divider, Button } from '@mckesson/mcp-component-library';
import './SelectedAccounts.scss';

export default function SelectedAccounts({ selectedAccounts, onRemoveAccount }) {
  return (
    <div className="selected-accounts-display">
      <h2 className="selected-account-heading">Selected Account</h2>
      <Divider className="selected-account-divider" />
      <div className="selected-account-container">
        {selectedAccounts?.map((item) => (
          <div key={item.id} className="selected-account">
            <div>
              <p className="selected-account-label">{item.dcName}</p>
              <p className="selected-account-label">({item.dcId})</p>
            </div>
            <Button
              Icon={DeleteIcon}
              variant="tertiary"
              iconButton={true}
              onClick={() => onRemoveAccount(item)}
              size="md"
              className="delete-icon"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
