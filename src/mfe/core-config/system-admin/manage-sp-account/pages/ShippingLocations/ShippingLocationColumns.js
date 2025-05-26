import React from 'react';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { MenuList, Tooltip } from '@mckesson/mcp-component-library';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { getAddress } from '../../util';

export const getShippingLocationColumns = (
  t,
  data,
  paginationConfig,
  handleOnOptionSelection,
  isCustomerCenter,
  selectedShippingLocation,
  setSelectedShippingLocation,
  orgUser
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
    minWidth: '450px',
    cell: (props) => <EclipsesTextcss str={getAddress(props.address)} maxWidth={350} />,
    sortable: false,
    sortKey: 'shippingAddress'
  },
  {
    id: 'id',
    name: t('manageSPAccount.table.shippingAccountNumber'),
    selector: (row) => row.id || '',
    minWidth: '250px',
    cell: (props) => <EclipsesTextcss str={props.id} maxWidth={230} />,
    sortable: true,
    sortKey: 'id'
  },
  {
    id: 'name',
    name: t('manageSPAccount.table.shippingaccountName'),
    selector: (row) => row.name || '',
    minWidth: '250px',
    cell: (props) => <EclipsesTextcss str={props.name} maxWidth={300} />,
    sortable: true,
    sortKey: 'name'
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
              label: (
                <Tooltip body={!allowAction ? t('manageSPAccount.shippingLocation.onerecordEdit') : ''}>
                  <div>{t('manageSPAccount.button.Edit')}</div>
                </Tooltip>
              ),

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
    omit: isCustomerCenter || orgUser,
    isAction: true
  }
];
