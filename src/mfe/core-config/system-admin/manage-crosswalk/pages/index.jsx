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
      allowedSort={['bnbNDC', 'spProductId', 'spProductName', 'trade_name']}
      fetchFn={SPCrosswalkService.getAllSPCrosswalk}>
      <List />
    </TableProvider>
  );
};

export default Index;
