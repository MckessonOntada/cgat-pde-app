import React from 'react';
import { ReactComponent as DeleteIcon } from '@src/assets/image/delete.svg';
import { Divider, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './SelectedAccounts.scss';
import { getAddress } from '@src/mfe/core-config/system-admin/manage-sp-account/util';
import CommonUtils from '@src/util/CommonUtils';

export default function SelectedAccounts({
  selectedAccounts,
  onRemoveAccount,
  header = '',
  isLinkCatalog = false,
  isLinkSpAccount = false
}) {
  const { t } = useTranslate();
  return (
    <div className="selected-accounts-display">
      <h2 className="selected-account-heading">
        {header ? header : t('account.selected.account')}
      </h2>
      <Divider className="selected-account-divider" />
      <div className="selected-account-container">
        {selectedAccounts?.map((item) => (
          <div key={item.id} className="selected-account">
            {isLinkCatalog && <div className="selected-account-label label-word-break">{`${item?.materialDescription}, (${item?.materialNumber})`}</div>}
            <div>
              {item.accountName && (
                <p className="selected-account-label">{item.accountName}</p>
              )}
              {item.accountNumber && (
                <p className="selected-account-label">
                  {!isLinkSpAccount
                    ? `( ${item.accountNumber} )`
                    : item.accountNumber}
                </p>
              )}
              {item.address && !isLinkSpAccount && (
                <p className="selected-account-label">
                  {`${CommonUtils.getFullName(item?.name) || ''}, ${
                    item?.address ? getAddress(item.address) : ''
                  }`}
                </p>

              )}
            </div>
            <Button Icon={DeleteIcon} variant="tertiary" iconButton={true} onClick={() => onRemoveAccount(item)} size="md" className="delete-icon" />
          </div>
        ))}
      </div>
    </div>
  );
}
