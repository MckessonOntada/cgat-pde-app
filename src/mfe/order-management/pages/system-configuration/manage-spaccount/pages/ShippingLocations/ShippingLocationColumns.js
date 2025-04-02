import React from 'react';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { MenuList } from '@mckesson/mcp-component-library';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';

export const getShippingLocationColumns = (t, handleOnOptionSelection, isCustomerCenter) => [
  {
    id: 'shippingAddress',
    name: t('manageSPAccount.table.shippingaddress'),
    selector: (row) => row.shippingAddress || '',
    maxWidth: '350px',
    cell: (props) => <EclipsesTextcss str={props.shippingAddress} maxWidth={240} />,
    sortable: true,
    sortKey: 'shippingAddress'
  },
  {
    id: 'shippingAccountNumber',
    name: t('manageSPAccount.table.shippingAccountNumber'),
    selector: (row) => row.shippingAccountNumber || '',
    maxWidth: '350px',
    cell: (props) => props.shippingAccountNumber,
    sortable: true,
    sortKey: 'shippingAccountNumber'
  },
  {
    id: 'shippingaccountName',
    name: t('manageSPAccount.table.shippingaccountName'),
    selector: (row) => row.shippingAccountName || '',
    maxWidth: '350px',
    cell: (props) => <EclipsesTextcss str={props.shippingAccountName} maxWidth={240} />,
    sortable: true,
    sortKey: 'shippingaccountName'
  },
  {
    id: 'action',
    center: true,
    name: t('manageSPAccount.table.action'),
    cell: (row) => (
      <MenuList
        menuIcon={<IconEllipsis key={'menu-list-spmaterial-table'} />}
        handleSelect={(value) => handleOnOptionSelection(value, row)}
        options={[
          {
            label: t('manageSPAccount.button.Edit'),
            value: 'edit'
          },
          {
            label: t('manageSPAccount.button.remove'),
            value: 'remove'
          }
        ]}
      />
    ),
    omit: isCustomerCenter,
    isAction: true
  }
];
