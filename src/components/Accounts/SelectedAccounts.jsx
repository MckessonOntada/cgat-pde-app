import React from 'react';
import { ReactComponent as DeleteIcon } from '@src/assets/image/delete.svg';
import { Divider, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './SelectedAccounts.scss';
import { getAddress } from '@src/mfe/order-management/pages/system-configuration/manage-spaccount/util';

export default function SelectedAccounts({ selectedAccounts, onRemoveAccount }) {
  const { t } = useTranslate();
  return (
    <div className="selected-accounts-display">
      <h2 className="selected-account-heading">{t('account.selected.account')}</h2>
      <Divider className="selected-account-divider" />
      <div className="selected-account-container">
        {selectedAccounts?.map((item) => (
          <div key={item.id} className="selected-account">
            <div>
              { item.accountName && <p className="selected-account-label">{item.accountName}</p> }
              { item.accountNumber && <p className="selected-account-label">( {item.accountNumber} )</p>}
              { item.address && <p className="selected-account-label">{ getAddress(item.address) }</p>}
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
