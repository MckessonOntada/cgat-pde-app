import React, { useState, useMemo } from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import AccountsData from './AccountsData';
import { Link } from 'react-router-dom';

const RECORDS_PER_PAGE = 8;
export default function AccountsList({ originalData = AccountsData, selectedRows, setSelectedRows }) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalRecords = useMemo(() => originalData.length, [originalData]);
    const totalPageCount = useMemo(
      () => Math.ceil(totalRecords / RECORDS_PER_PAGE),
      [totalRecords]
    );

  const columns = [
    {
      id: 'id',
      name: 'Account Number',
      cell: (row) => (
        <Link to={row.url} className="org-name">
          {row.id}
        </Link>
      ),
      wrap: true,
      width: '25%'
    },
    {
      id: 'name',
      name: 'Account Name',
      wrap: true,
      selector: (row) => row.name
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

  // Calculate the data slice for the current page
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * RECORDS_PER_PAGE;
    const end = start + RECORDS_PER_PAGE;
    return originalData.slice(start, end);
  }, [originalData, currentPage]);

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows); // Pass entire row data to CreateOrgStep2
  };

  return (
    <div>
      <CustomDataTable
        id="my-data-table"
        type="normal"
        columns={columns}
        data={paginatedData} // Use the sliced data for the current page
        currentPage={currentPage}
        totalPageCount={totalPageCount}
        pagination={true}
        handleChangePage={handleChangePage}
        totalRocords={totalRecords}
        recordsPerPage={RECORDS_PER_PAGE}
        paginationTotalRecorsMessage={'results'}
        paginationRecordsPerPageMessage={`per page`}
        isAdmin={true}
        selectableRows
        handleRowSelected={handleRowSelected}
        selectedRowId={selectedRows}
      />
    </div>
  );
}
