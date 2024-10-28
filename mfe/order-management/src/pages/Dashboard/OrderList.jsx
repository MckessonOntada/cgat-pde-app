import React from 'react';
import { CustomDataTable } from '@mckesson/mcp-component-library';
import { UseOrder } from '../../context/PageContext';
import { useTranslation } from 'react-i18next';
import { Badge } from '@mckesson/mcp-component-library';

const OrderList = () => {
  const { t } = useTranslation();

  const columns = [
    {
      id: 'patient_name',
      name: t('patient_name'),
      sortable: true,
      selector: row => row.patient_name,
      width: '20%',
    },
    {
      id: 'order_id',
      name: t('order_id'),
      sortable: true,
      selector: row => row.order_Id,
      width: '10%',
    },
    {
      id: 'account_name',
      name: t('account_name'),
      sortable: true,
      selector: row => row.account_name,
      width: '25%',
    },
    {
      id: 'order_total',
      name: t('order_total'),
      sortable: true,
      selector: row => row.order_total,
      width: '10%',
    },
    {
      id: 'created_date',
      name: t('created_date'),
      sortable: true,
      selector: row => row.created_date,
      width: '10%',
    },
    {
      id: 'last_updated',
      name: t('last_updated'),
      sortable: true,
      selector: row => row.last_updated,
      width: '10%',
    },

    {
      id: 'status',
      name: t('status'),
      center: true,
      cell: row => (
        <Badge
          text={row.status === 'SUBMITTED' ? 'SUBMITTED' : row.status === 'PENDING' ? 'PENDING APPROVAL' : 'DRAFT'}
          type={row.status === 'SUBMITTED' ? 'success' : 'info-default'}
        />
      ),
      width: '15%',
    },
  ];
  const {
    data,
    pagination: {
      currentPage,
      totalPageCount,
      totalRecords,
      recordsPerPage,
      update: { setCurrentPage },
    },
  } = UseOrder();

  const handleChangePage = (e, newPage) => {
    setCurrentPage(newPage);
  };

  const handleSort = (selectedColumn, sortDirection, sortedRows) => {
    // TODO
  };

  return (
    <CustomDataTable
      id="my-data-table"
      type="normal"
      columns={columns}
      data={data}
      onSortIconClick={handleSort}
      currentPage={currentPage}
      totalPageCount={totalPageCount}
      pagination={true}
      handleChangePage={handleChangePage}
      totalRocords={totalRecords}
      recordsPerPage={recordsPerPage}
      paginationTotalRecorsMessage={`Total records: ${totalRecords}`}
      paginationRecordsPerPageMessage={`Records per page: ${recordsPerPage}`}
      isAdmin={true}
    />
  );
};

export default OrderList;
