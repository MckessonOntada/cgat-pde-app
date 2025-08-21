import { Heading } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';
import React from 'react';
import ShippingAddressDataTable from './ShippingAddressDataTable';
import CommonFilters from '@src/components/Filters';
import { useTranslate } from '@src/translations/useTranslation';
import { useShippingAddress } from '@src/mfe/order-management/context/ShippingAddressContext';
import TableHeading from '@src/components/tableHeading/TableHeading';

function ShippingAddress({ selectedShippingAddress, setSelectedShippingAddress, readOnly }) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters, selectedAccount } = useShippingAddress();

  return (
    <div className={`MCP-module-body ${!selectedAccount ? 'disable-all' : ''}`}>
      <div className="MCP-CardContainer">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={[]}
          searchPlaceholder={t('controls.placeholder.shippingAddress.search')}
        />
      </div>
      <TableHeading heading={t('headings.shippingAddress')} />

      <div className="MCP-table-wrapper">
        <ShippingAddressDataTable
          selectedShippingAddress={selectedShippingAddress}
          setSelectedShippingAddress={setSelectedShippingAddress}
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}

export default ShippingAddress;
