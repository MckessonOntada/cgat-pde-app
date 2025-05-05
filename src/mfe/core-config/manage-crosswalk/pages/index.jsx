import React from 'react';
import List from './list';
import { TableProvider } from '../../manage-providers/context/TableContext';
import SPCrosswalkService from '@src/api/commonService/SPCrosswalkService';

const Index = () => {
  const defaultFilters = {
    search: '',
    status: ''
  };
  return (
    <TableProvider
      defaultFilters={defaultFilters}
      defaultSort={{
        sortOrder: 'desc'
      }}
      allowedSort={[
        'bnbMaterialNumber',
        'spProductId',
        'spProductName',
        'bnbMaterialDescription'
      ]}
      fetchFn={SPCrosswalkService.getAllSPCrosswalk}>
      <List />
    </TableProvider>
  );
};

export default Index;
