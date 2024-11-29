import React from 'react';
import { Pills } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import './SelectedAccounts.scss';

const SelectedAccountChips = ({ selectedAccounts, onRemoveAccount }) => {
  const { t } = useTranslate();

  const createLabelData = (account) => [
    {
      id: account.accountNumber,
      labelText: account.accountName
    }
  ];

  return (
    <div className="selected-account-chip-container">
      <h2 className="title">{t('account.selected.account')} - </h2>
      <div className="pills-container">
        {selectedAccounts?.map((item) => (
          <Pills key={item.id} labels={createLabelData(item)} variant="secondary" hasDeleteIcon={true} onDelete={() => onRemoveAccount(item)} />
        ))}
      </div>
    </div>
  );
};

export default SelectedAccountChips;
