import React from 'react';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { MenuList } from '@mckesson/mcp-component-library';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';

export const getShippingLocationColumns = (
  t,
  data,
  paginationConfig,
  handleOnOptionSelection,
  isCustomerCenter,
  selectedShippingLocation,
  setSelectedShippingLocation
) => [
  {
    id: 'checkbox',
    name: renderTableCheckBox(
      { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
      data,
      'id',
      paginationConfig,
      selectedShippingLocation,
      setSelectedShippingLocation
    ),
    sortable: false,
    cell: (row, index) => renderTableCheckBox(row, data, 'id', paginationConfig, selectedShippingLocation, setSelectedShippingLocation),
    width: '50px',
    omit: isCustomerCenter
  },
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
    cell: (row) => {
      const isRowSelected = selectedShippingLocation.some((item) => item.id === row.id);
      const isOnlyOneSelected = selectedShippingLocation.length === 1;
      const allowAction = selectedShippingLocation?.length === 0 || (isRowSelected && isOnlyOneSelected);

      return (
        <MenuList
          menuIcon={<IconEllipsis key={'menu-list-shippinglocation-table'} />}
          handleSelect={(value) => handleOnOptionSelection(value, row)}
          options={[
            {
              label: t('manageSPAccount.button.Edit'),
              value: 'edit',
              disabled: !allowAction
            },
            {
              label: t('manageSPAccount.button.remove'),
              value: 'remove',
              disabled: !allowAction
            }
          ]}
        />
      );
    },
    omit: isCustomerCenter,
    isAction: true
  }
];
