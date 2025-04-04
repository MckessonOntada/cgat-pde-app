import React from 'react';
import List from './list';
import ProviderService from '@src/api/commonService/ProviderService';
import { TableProvider } from '../../manage-providers/context/TableContext';

const Index = () => {
  const defaultFilters = {
    search: '',
    status: ''
  };
  return (
    <TableProvider
      defaultFilters={defaultFilters}
      fetchFn={ProviderService.getProviders}>
      <List />
    </TableProvider>
  );
};

export default Index;
