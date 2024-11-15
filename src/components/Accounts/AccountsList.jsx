import React, { useMemo, useState } from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import SelectedAccounts from './SelectedAccounts';
import './styles.scss';
import Actions from './Action';

const RECORDS_PER_PAGE = 8;

// TODO: Create filter context
export default function AccountsList({
  data,
  selectedRows,
  setSelectedRows,
  onRemoveAccount,
  showSelectedAccounts = false, // This is to show selected accounts in right rail
  selectableRows = true, // To enable or disable row selection
  omitColumns = [] // Pass column ids which you don't want to show in table.
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const columns = useMemo(
    () => [
      {
        id: 'id',
        name: 'Account Number',
        cell: (row) => (
          <Link to={row.url} className="org-name">
            {row.dcId}
          </Link>
        ),
        wrap: true,
        width: '15%'
      },
      {
        id: 'name',
        name: 'Account Name',
        wrap: true,
        selector: (row) => row.dcName,
        width: '25%',
        cell: (row) => <div className="cellEllipse">{row.dcName}</div>
      },
      {
        id: 'org',
        name: 'Sales Org',
        selector: (row) => row.org,
        wrap: true
      },
      {
        id: 'distributionChannel',
        name: 'Distribution Channel',
        selector: (row) => row.distributionChannel,
        wrap: true,
        cell: (row) => <div className="cellEllipse">{row.distributionChannel}</div>,
        omit: omitColumns.includes('distributionChannel')
      },
      {
        id: 'address',
        center: true,
        name: 'Address', // t('userManagement.table.action'),
        cell: (row) => row.cgatIdentifier,
        omit: omitColumns.includes('address')
      },
      {
        id: 'cgatIdentifier',
        center: true,
        name: 'CGAT Identifier', // t('userManagement.table.action'),
        cell: (row) => <div className="cellEllipse">{row.cgatIdentifier}</div>,
        omit: omitColumns.includes('cgatIdentifier')
      },
      {
        id: 'action',
        center: true,
        name: 'Actions', // t('userManagement.table.action'),
        cell: (row) => <Actions row={row} />,
        width: '10%',
        omit: omitColumns.includes('action')
      }
    ],
    [omitColumns]
  );

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows); // Pass entire row data to CreateOrgStep2
  };

  return (
    <div className="account-box">
      <div className="customTable-box">
        <CustomDataTable
          id="my-data-table"
          type="normal"
          columns={columns}
          data={data.content} // Use the sliced data for the current page
          currentPage={currentPage}
          totalPageCount={data.totalPages}
          pagination={true}
          handleChangePage={handleChangePage}
          totalRocords={data.totalElements}
          recordsPerPage={RECORDS_PER_PAGE}
          paginationTotalRecorsMessage={'results'}
          paginationRecordsPerPageMessage={`per page`}
          isAdmin={true}
          selectableRows={selectableRows}
          handleRowSelected={handleRowSelected}
          selectedRowId={selectedRows}
        />
      </div>
      {showSelectedAccounts && (
        <div className="selected-account-box">
          <SelectedAccounts selectedAccounts={selectedRows} onRemoveAccount={onRemoveAccount} />
        </div>
      )}
    </div>
  );
}
