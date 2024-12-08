import React, { useMemo } from 'react';
import CommonFilters from '@src/components/Filters';
import { useAccounts } from './AccountsContext';
import { useTranslate } from '@src/translations/useTranslation';

export default function AccountsFilter() {
  const { applyFilters, clearFilters } = useAccounts();
  const { t } = useTranslate();

  const AdditionalFiltersConfig = useMemo(() => {
    return [
      {
        type: 'dropdown',
        name: 'status',
        label: 'Status', // Use translation
        options: [
          { label: 'All', value: 'all' },
          { label: 'Inactive', value: 'inactive' },
          { label: 'Active', value: 'active' }
        ]
      },
      {
        type: 'dropdown',
        name: 'salesOrg',
        label: 'Sales Organization', // Use translation
        options: [
            { label: 'MPB', value: 'so76' },
            { label: 'Speciality', value: 1000 },
            { label: '3PL', value: 1100 }
          ]
      },
      {
        type: 'dropdown',
        name: 'distChannels',
        label: 'Distribution Channels', // Use translation
        options:  [
            { label: '10', value: '10' },
            { label: '20', value: '20' },
            { label: '30', value: '30' },
            { label: '40', value: '40' },
            { label: '50', value: '50' },
            { label: '60', value: '60' }
          ]        
      }
    ];
  }, []);

  return <CommonFilters onApplyFilters={applyFilters} onClearFilters={clearFilters} additionalFilters={AdditionalFiltersConfig} searchPlaceholder={t('orgManagement.filters.status.label')} />;
}
