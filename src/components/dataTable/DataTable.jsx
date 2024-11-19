import React, { useState, useEffect } from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';

const DataTable = ({
  type = 'normal',
  rows,
  columns,
  handleSortClick,
  handleChangePage,
  selectableRows = false,
  pagination = true
}) => {
  const totalRecords = rows.length;
  const recordsPerPage = 8;
  const totalPageCount = Math.ceil(totalRecords / recordsPerPage); 
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]); 
  const paginationRecordsPerPageMessage = `per page`;
  const paginationTotalRecordsMessage = `results`;

  useEffect(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    setCurrentData(rows.slice(indexOfFirstRecord, indexOfLastRecord));
  }, [currentPage, rows]);

  const onPageChange = (newPage) => {
    setCurrentPage(newPage);
    if (handleChangePage) {
      handleChangePage(newPage);
    }
  };

  return (
    <CustomDataTable
      type={type}
      columns={columns}
      data={currentData}
      onSortIconClick={handleSortClick}
      handleChangePage={(e, newPage) => onPageChange(newPage)}
      selectableRows={selectableRows}
      pagination={pagination}
      currentPage={currentPage}
      totalPageCount={totalPageCount}
      totalRocords={totalRecords}
      recordsPerPage={recordsPerPage}
      paginationRecordsPerPageMessage={paginationRecordsPerPageMessage}
      paginationTotalRecorsMessage={paginationTotalRecordsMessage}
      // isStickyPagination={pagination}
      stickyHeader
      responsive
    />
  );
};

export default DataTable;
