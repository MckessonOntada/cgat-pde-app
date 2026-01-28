import React from 'react';
import List from './list';
import ProviderService from '@src/api/commonService/ProviderService';
import { TableProvider } from '@src/context/TableContext';

const Index = () => {
  const defaultFilters = {
    search: '',
    status: ''
  };

  return (
    <TableProvider defaultFilters={defaultFilters} allowedSort={['first_name']} fetchFn={ProviderService.getAllProviders}>
      <List />
    </TableProvider>
  );
};

export default Index;
