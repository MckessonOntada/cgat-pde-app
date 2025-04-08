import React from 'react';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { getAddress } from '../../util';
import { IconButton } from '@mckesson/mcp-component-library';
import { ReactComponent as linkIcon } from '@src/assets/svg/link.svg';
import { Link } from 'react-router-dom';


export const getLinkProviderColumns = (
  t,
  data,
  paginationConfig,
  handleOnOptionSelection,
  selectedLinkProvider,
  setSelectedLinkProvider,
  setOpenProviderDetails,
  setDrawerDetails,
  formatProviderDetails
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
    minWidth: '180px',
    sortable: true,
    sortKey: 'providerName',
    cell: (props) => (
      <div className="cellEllipse">
        <Link
          style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}
          onClick={() => {
            setOpenProviderDetails(true);
            setDrawerDetails(formatProviderDetails(props));
          }}>
          {props?.providerName || '-'}
        </Link>
      </div>
    ),
  },
  {
    id: 'address',
    name: t('manageSPAccount.column.providers.address'),
    selector: (row) => row.address || '',
    minWidth: '400px',
    cell: (props) => <EclipsesTextcss str={getAddress(props.address)} maxWidth={380} />,
    sortable: false,
    sortKey: 'address'
  },
  {
    id: 'deaNumber',
    name: t('manageSPAccount.column.providers.deaNumber'),
    selector: (row) => row.deaNumber || '',
    minWidth: '150px',
    cell: (props) => <EclipsesTextcss str={props.deaNumber} maxWidth={300} />,
    sortable: true,
    sortKey: 'deaNumber'
  },
  {
    id: 'npiNumber',
    name: t('manageSPAccount.column.providers.npiNumber'),
    selector: (row) => row.npiNumber || '',
    minWidth: '150px',
    cell: (props) => <EclipsesTextcss str={props.npiNumber} maxWidth={300} />,
    sortable: true,
    sortKey: 'npiNumber'
  },
  {
    id: 'action',
    center: true,
    name: t('manageSPAccount.table.action'),
    cell: (row) => {
      return (
         <IconButton
            label= {t('manageSPAccount.providers.column.unlink')}
            size="lg"
            iconButton={false}
            textButton={true}
            Icon={linkIcon}
            onClick={() => handleOnOptionSelection(row)}
          />
      );
    },
    isAction: true
  }
];
