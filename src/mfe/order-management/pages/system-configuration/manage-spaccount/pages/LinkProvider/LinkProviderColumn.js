import React from 'react';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { getAddress } from '../../util';
import { IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as linkIcon } from '@src/assets/svg/link.svg';
import { Link } from 'react-router-dom';
import CommonUtils from '@src/util/CommonUtils';

export const getLinkProviderColumns = (
  t,
  data,
  paginationConfig,
  unLinkProvider,
  selectedLinkProvider,
  setSelectedLinkProvider,
  handleProviderDetails,
  isAddLinkProvider,
  isCustomerCenter
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
    cell: (row, index) =>
      renderTableCheckBox(
        row,
        data,
        'id',
        paginationConfig,
        selectedLinkProvider,
        setSelectedLinkProvider
      ),
    width: '50px'
  },
  {
    id: 'name',
    name: t('manageSPAccount.column.providerName'),
    selector: (row) => row.name || '',
    minWidth: '180px',
    sortable: true,
    sortKey: 'full_name',
    cell: (props) => (
      <div className="cellEllipse">
        <Link
          style={{
            color: '#007bff',
            fontWeight: '600',
            textDecoration: 'none'
          }}
          onClick={() => {
            handleProviderDetails(props.id);
          }}>
          {CommonUtils.getFullName(props?.name) || '-'}
        </Link>
      </div>
    )
  },
  {
    id: 'address',
    name: t('manageSPAccount.column.providers.address'),
    selector: (row) => row.address || '',
    minWidth: '400px',
    cell: (props) => (
      <EclipsesTextcss str={getAddress(props.address)} maxWidth={380} />
    ),
  },
  {
    id: 'dea',
    name: t('manageSPAccount.column.providers.deaNumber'),
    selector: (row) => row.dea || '',
    minWidth: '150px',
    cell: (props) => <EclipsesTextcss str={props.dea} maxWidth={300} />,
     sortable: true,
    sortKey: 'dea',
  },
  {
    id: 'npi',
    name: t('manageSPAccount.column.providers.npiNumber'),
    selector: (row) => row.npi || '',
    minWidth: '150px',
    cell: (props) => <EclipsesTextcss str={props.npi} maxWidth={300} />,
    sortable: true,
    sortKey:'npi'
  },
  {
    id: 'action',
    center: true,
    name: t('manageSPAccount.table.action'),
    isAction: true,
    cell: (row) => {
      return (
        <IconButton
          label={t('manageSPAccount.providers.column.unlink')}
          size="lg"
          iconButton={false}
          textButton={true}
          Icon={linkIcon}
          disabled={selectedLinkProvider.length > 0}
          onClick={() => unLinkProvider(row)}
        />
      );
    },
    omit: isCustomerCenter || isAddLinkProvider 
  }
];
