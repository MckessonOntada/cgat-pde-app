import React from 'react';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { Link } from 'react-router-dom';
import CommonUtils, { getAddress } from '@src/util/CommonUtils';
import { IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as linkIcon } from '@src/assets/svg/link.svg';

export const getTableColumn = (
  t,
  data,
  paginationConfig,
  selectedSpAccount,
  setSelectedSpAccount,
  isAddLinkProvider,
  unLinkSpAccount
) => [
  {
    id: 'checkbox',
    name: renderTableCheckBox(
      { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
      data,
      'id',
      paginationConfig,
      selectedSpAccount,
      setSelectedSpAccount
    ),
    sortable: false,
    cell: (row, index) =>
      renderTableCheckBox(
        row,
        data,
        'id',
        paginationConfig,
        selectedSpAccount,
        setSelectedSpAccount
      ),
    width: '50px'
  },
  {
    id: 'accountName',
    name: t('table.columns.captions.accountName'),
    selector: (row) => row.accountName || '',
    minWidth: '140px',
    sortable: true,
    sortKey: 'name_1',
    cell: (props) => (
      <div className="cellEllipse">
        <Link
          style={{
            color: '#007bff',
            fontWeight: '600',
            textDecoration: 'none'
          }}
          onClick={(e) => {
            e.preventDefault();
          }}>
          <EclipsesTextcss str={props?.accountName || '-'} maxWidth={300} />
        </Link>
      </div>
    )
  },
  {
    id: 'accountNumber',
    name: t('table.columns.captions.accountNumber'),
    selector: (row) => row.accountNumber || '',
    minWidth: '140px',
    sortable: true,
    sortKey: 'sap_partner',
    cell: (props) => (
      <EclipsesTextcss str={props?.accountNumber || '-'} maxWidth={300} />
    )
  },
  {
    id: 'address',
    name: t('table.columns.captions.address'),
    selector: (row) => row.address || '',
    minWidth: '240px',
    cell: (props) => (
      <EclipsesTextcss str={getAddress(props.address)} maxWidth={380} />
    )
  },
  {
    id: 'action',
    center: true,
    name: t('manageSPAccount.table.action'),
    isAction: true,
    width: '200px',
    cell: (row) => {
      return (
        <IconButton
          label={t('manageSPAccount.providers.column.unlink')}
          size="lg"
          iconButton={false}
          textButton={true}
          Icon={linkIcon}
          disabled={selectedSpAccount.length > 0}
          onClick={() => unLinkSpAccount([row])}
        />
      );
    },
    omit: isAddLinkProvider
  }
];
