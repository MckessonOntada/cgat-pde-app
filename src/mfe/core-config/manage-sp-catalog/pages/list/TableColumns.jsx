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
      id: PROVIDER_COLUMNS.PROVIDER_NAME,
      name: 'Provider Name',
      selector: (row) => row.providerName,
      minWidth: '160px',
      sortable: true,
      sortKey: 'providerName',
      cell: (props) => <div>{props?.providerName || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.ADDRESS,
      name: 'Address',
      selector: (row) => row.address,
      minWidth: '160px',
      cell: (props) => <div>{props?.address || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.DEA_NUMBER,
      name: 'DEA Number',
      selector: (row) => row.deaNumber,
      minWidth: '160px',
      cell: (props) => <div>{props?.deaNumber || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.NPI_NUMBER,
      name: 'NPI Number',
      selector: (row) => row.npiNumber,
      minWidth: '160px',
      cell: (props) => <div>{props?.npiNumber || '-'}</div>
    },
    {
      id: PROVIDER_COLUMNS.STATUS,
      name: 'Status',
      selector: (row) => row.status,
      minWidth: '160px',
      cell: (props) => (
        <Badge
          text={`label.status.${props.status ? 'active' : 'inactive'}`}
          type={'success'}
        />
      )
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
