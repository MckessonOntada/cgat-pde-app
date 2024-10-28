import React, { useState, useEffect } from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';

const DataTable = ({
  type = 'normal',
  rows,
  columns,
  handleSortClick,
  handleChangePage,
  selectableRows = false,
  pagination = true,
}) => {
  const totalRecords = rows.length;
  const recordsPerPage = 5;
  const totalPageCount = Math.ceil(totalRecords / recordsPerPage);
  // const paginationRecordsPerPageMessage = "Rows per page";
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const startRecord = (currentPage - 1) * recordsPerPage + 1;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);
  // const paginationTotalRecordsMessage = `Showing ${totalRecords} results`;
  //const paginationRecordsPerPageMessage = `${startRecord} - ${endRecord} (${endRecord - startRecord + 1} rows per page)`;
  const paginationRecordsPerPageMessage = `${startRecord} - ${endRecord} (${recordsPerPage} rows per page)`;
  const paginationTotalRecordsMessage = `Showing ${totalRecords} results`;

  useEffect(() => {
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    setCurrentData(rows.slice(indexOfFirstRecord, indexOfLastRecord));
  }, [currentPage, rows]);

  const onPageChange = newPage => {
    setCurrentPage(newPage);
    if (handleChangePage) {
      handleChangePage(newPage);
    }
  };

  return (
    <div>
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
        isStickyPagination={pagination}
      />
    </div>
  );
};

export default DataTable;
