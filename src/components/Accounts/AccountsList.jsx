import React, { useState, useMemo } from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import AccountsData from './AccountsData';
import { Link } from 'react-router-dom';
import SelectedAccounts from './SelectedAccounts';
import './styles.scss';

const RECORDS_PER_PAGE = 8;

// TODO: Create filter context
export default function AccountsList({
  originalData = AccountsData,
  selectedRows,
  setSelectedRows,
  onRemoveAccount,
  showSelectedAccounts = false // This is to show selected accounts in right rail
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const columns = [
    {
      id: 'id',
      name: 'Account Number',
      cell: (row) => (
        <Link to={row.url} className="org-name">
          {row.dcId}
        </Link>
      ),
      wrap: true,
      width: '25%'
    },
    {
      id: 'name',
      name: 'Account Name',
      wrap: true,
      selector: (row) => row.dcName
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
      wrap: true
    }
  ];

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
          data={originalData.content} // Use the sliced data for the current page
          currentPage={currentPage}
          totalPageCount={originalData.totalPages}
          pagination={true}
          handleChangePage={handleChangePage}
          totalRocords={originalData.totalElements}
          recordsPerPage={RECORDS_PER_PAGE}
          paginationTotalRecorsMessage={'results'}
          paginationRecordsPerPageMessage={`per page`}
          isAdmin={true}
          selectableRows
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
