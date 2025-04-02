import React from 'react';
import { Badge, MenuList } from '@mckesson/mcp-component-library';
import { ReactComponent as EllipsisIcon } from '@src/assets/svg/ellipsis.svg';

const PROVIDER_COLUMNS = {
  PROVIDER_NAME: 'PROVIDER_NAME',
  ADDRESS: 'ADDRESS',
  DEA_NUMBER: 'DEA_NUMBER',
  NPI_NUMBER: 'NPI_NUMBER',
  STATUS: 'STATUS',
  ACTION: 'ACTION'
};

const columns = [
  {
    id: PROVIDER_COLUMNS.PROVIDER_NAME,
    name: 'Provider Name',
    selector: (row) => row.providerName,
    minWidth: '160px',
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
    cell: (props) => <Badge text={`labels.status.${props.status.toLowerCase()}`} type={'success'} />
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
        aria-label="Order options"
      />
    )
  }
];

export default columns;
