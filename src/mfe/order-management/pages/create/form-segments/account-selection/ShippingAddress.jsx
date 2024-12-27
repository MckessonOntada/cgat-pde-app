import { Heading } from '@mckesson/mcp-component-library';
import ModuleHeader from '@src/components/module-header';
import React from 'react';
import ShippingAddressDataTable from './ShippingAddressDataTable';
import CommonFilters from '@src/components/Filters';
import { useTranslate } from '@src/translations/useTranslation';
import { useShippingAddress } from '@src/mfe/order-management/context/ShippingAddressContext';

function ShippingAddress({ selectedShippingAddress, setSelectedShippingAddress }) {
  const { t } = useTranslate();
  const { applyFilters, clearFilters } = useShippingAddress();

  return (
    <div className="MCP-module-body">
      <ModuleHeader heading={<Heading as="h2">{t('headings.shippingAddress')}</Heading>} />
      <div className="MCP-panel-container">
        <CommonFilters
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
          additionalFilters={[]}
          searchPlaceholder={t('controls.placeholder.shippingAddress.search')}
        />
      </div>
      <div className="MCP-table-wrapper">
        <ShippingAddressDataTable
          selectedShippingAddress={selectedShippingAddress}
          setSelectedShippingAddress={setSelectedShippingAddress}
        />
      </div>
    </div>
  );
}

export default ShippingAddress;
