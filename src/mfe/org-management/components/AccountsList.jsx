import React, { useState, useMemo } from "react";
import { CustomDataTable } from '@mckesson/mcp-component-library';
import AccountsData from "./AccountsData";
import { Link } from "react-router-dom";

const RECORDS_PER_PAGE = 5;
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
      wrap: true
    },
    {
      id: 'org',
      name: 'Sales Org',
      wrap: true
    },
    {
      id: 'distributionChannel',
      name: 'Distribution Channel',
      wrap: true
    },

  ];

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowSelected = (values) => {
    setSelectedRows(values.selectedRows);
  }
  return (
    <CustomDataTable
      id="accounts"
      type="normal"
      columns={columns}
      data={AccountsData} 
      currentPage={currentPage}
      totalPageCount={totalPageCount}
      pagination={true}
      handleChangePage={handleChangePage}
      totalRocords={totalRecords} // Corrected typo here
      recordsPerPage={RECORDS_PER_PAGE}
      paginationTotalRecorsMessage={'results'}
      paginationRecordsPerPageMessage={`per page`}
      isAdmin={true}
      selectableRows
      handleRowSelected={handleRowSelected}
      selectedRows={selectedRows}
    />
  );
}
