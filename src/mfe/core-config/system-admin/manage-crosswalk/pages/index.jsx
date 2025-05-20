import React from 'react';
import List from './list';

import SPCrosswalkService from '@src/api/commonService/SPCrosswalkService';
import { TableProvider } from '@src/mfe/core-config/admin/manage-providers/context/TableContext';

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
      allowedSort={['bnbMaterialNumber', 'spProductId', 'spProductName', 'bnbMaterialDescription']}
      fetchFn={SPCrosswalkService.getAllSPCrosswalk}>
      <List />
    </TableProvider>
  );
};

export default Index;
