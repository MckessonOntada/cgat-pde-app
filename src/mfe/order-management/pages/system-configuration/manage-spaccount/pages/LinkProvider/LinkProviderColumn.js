import React from 'react';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { getAddress } from '../../util';
import { Button } from '@mckesson/mcp-component-library';


export const getLinkProviderColumns = (
  t,
  data,
  paginationConfig,
  handleOnOptionSelection,
  selectedLinkProvider,
  setSelectedLinkProvider
) => [
  {
    id: 'checkbox',
    name: renderTableCheckBox(
      { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
      data,
      'id',
      paginationConfig,
      selectedLinkProvider,
      setSelectedLinkProvider
    ),
    sortable: false,
    cell: (row, index) => renderTableCheckBox(row, data, 'id', paginationConfig, selectedLinkProvider, setSelectedLinkProvider),
    width: '50px',
  },
  {
    id: 'providerName',
    name: t('manageSPAccount.column.providerName'),
    selector: (row) => row.providerName || '',
    minWidth: '410px',
    cell: (props) => props.providerName,
    sortable: true,
    sortKey: 'providerName'
  },
  {
    id: 'address',
    name: t('manageSPAccount.column.providers.address'),
    selector: (row) => row.address || '',
    minWidth: '450px',
    cell: (props) => <EclipsesTextcss str={getAddress(props.address)} maxWidth={350} />,
    sortable: false,
    sortKey: 'address'
  },
  {
    id: 'deaNumber',
    name: t('manageSPAccount.column.providers.deaNumber'),
    selector: (row) => row.deaNumber || '',
    minWidth: '410px',
    cell: (props) => <EclipsesTextcss str={props.deaNumber} maxWidth={300} />,
    sortable: true,
    sortKey: 'deaNumber'
  },
  {
    id: 'npiNumber',
    name: t('manageSPAccount.column.providers.npiNumber'),
    selector: (row) => row.npiNumber || '',
    minWidth: '410px',
    cell: (props) => <EclipsesTextcss str={props.npiNumber} maxWidth={300} />,
    sortable: true,
    sortKey: 'npiNumber'
  },
  {
    id: 'action',
    center: true,
    name: t('manageSPAccount.table.action'),
    cell: (row) => {
      const isRowSelected = selectedLinkProvider.some((item) => item.id === row.id);
      const isOnlyOneSelected = selectedLinkProvider.length === 1;
    //   const allowAction = selectedLinkProvider?.length === 0 || (isRowSelected && isOnlyOneSelected);
      return (
        <Button onClick={() => handleOnOptionSelection(row)}>{t('manageSPAccount.providers.column.unlink')}</Button>
      );
    },
    isAction: true
  }
];
