import React from 'react';
import {
  Badge,
  MenuList,
  CheckboxGroup
} from '@mckesson/mcp-component-library';
import { ReactComponent as EllipsisIcon } from '@src/assets/svg/ellipsis.svg';
import { useSelection } from '@src/mfe/core-config/manage-providers/context/TableContext';

const PROVIDER_COLUMNS = {
  SP_PRODUCT_ID: 'PROVIDER_NAME',
  PRODUCT_NAME: 'PRODUCT_NAME',
  NDC: 'NDC',
  DIST_CHANNEL: 'DIST_CHANNEL',
  ACCOUNT_NUMBER: 'ACCOUNT_NUMBER',
  ACTION: 'ACTION'
};

export const getColumns = () => {
  const { selectedRows, toggleRowSelection, selectAll, deselectAll } =
    useSelection();
  return [
    {
      id: 'checkbox',
      name: '',
      showInMobileHeader: true,
      cell: (props) => (
        <CheckboxGroup
          id={'default'}
          caption=""
          items={[
            {
              onChange: () => toggleRowSelection(props.id),
              value: props.id,
              isChecked: selectedRows.has(props.id),
              isDisabled: !props.isActive
            }
          ]}
        />
      ),
      wrap: true,
      width: '40px'
    },
    {
      id: 'SP_PRODUCT_ID',
      name: 'SP Product Id',
      selector: (row) => row.productName,
      minWidth: '160px',
      sortable: true,
      sortKey: 'spProductId',
      cell: (props) => <div>{props?.spProductId || '-'}</div>
    },
    {
      id: 'PRODUCT_NAME',
      name: 'Product Name',
      selector: (row) => row.productName,
      minWidth: '160px',
      sortable: true,
      sortKey: 'productName',
      cell: (props) => <div>{props?.spProductName || '-'}</div>
    },
    {
      id: 'NDC',
      name: 'ndc',
      selector: (row) => row.ndc,
      minWidth: '160px',
      cell: (props) => <div>{props?.ndc || '-'}</div>
    },
    {
      id: 'ACCOUNT_NUMBER',
      name: 'Account Number',
      selector: (row) => row.accountNumber,
      minWidth: '160px',
      cell: (props) => <div>{props?.accountNumber || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.ACTION,
      name: 'Action',
      selector: () => {},
      minWidth: '160px',
      cell: () => (
        <MenuList
          menuIcon={<EllipsisIcon />}
          handleSelect={(e) => {}}
          options={[
            { label: 'Edit', value: 'edit' },
            { label: 'Deactivate', value: 'Deactivate' },
            { label: 'Link SP Account', value: 'linkSPAccount' }
          ]}
        />
      )
    }
  ];
};
