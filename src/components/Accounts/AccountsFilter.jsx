import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import { useAccounts } from './AccountsContext';
import { useTranslate } from '@src/translations/useTranslation';

export default function AccountsFilter({ autoFocus }) {
  const { applyFilters, clearFilters } = useAccounts();
  const { t } = useTranslate();

  return (
    <CommonFilters
      autoFocus={autoFocus}
      onApplyFilters={applyFilters}
      onClearFilters={clearFilters}
      additionalFilters={[]}
      searchPlaceholder={t('account.filter.search')}
    />
  );
}
