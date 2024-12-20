import React, { useState } from 'react';
import { Button,CustomDataTable,Loader } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as CrossIcon } from "../../../../assets/svg/cross-red.svg"
import { usePendingPayments } from '../../context/PendingPaymentsContext';


export default function PendingPaymentTable() {
  const { t } = useTranslate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort } = usePendingPayments();

  const columns = [
    {
      name: t('pendingPayments.table.confirmationNumber'),
      selector: (row) => `${row.confirmationNo}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}>{`${props.confirmationNo}`}</Link>
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.paymentMethod'),
      selector: (row) => row.paymentMethod,
      minWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props.paymentMethod}</div>
    },
    {
      name: t('paymentInvoices.history.table.paymentInitiationDate'),
      selector: (row) => row.paymentInitiationDate,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      cell: (props) => <EclipsesTextcss className="cellEllipse" str={props.paymentInitiationDate} maxWidth={240} />
    },
    {
      name: t('pendingPayments.table.totalAuthorizedPaymentAmt'),
      selector: (row) => row.authorizedAmt,
      minWidth: '200px',
      sortable: true,
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props.authorizedAmt}</div>
    },
    {
      name: t('paymentInvoices.history.table.Actions'),
      minWidth: '144px',
      sortable: false,
      wrap: true,
      cell: (props) => (
        <Button className="cancel-button-control" variant="tertiary" Icon={() => <CrossIcon />} onClick={() => {}} size="md">
          {t('pendingPayments.table.cancelPayment')}
        </Button>
      )
    }
  ];
  const handleSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };
  return (
    <React.Fragment>
      {/* <DataTable columns={columns} rows={filteredData} responsive /> */}
      <CustomDataTable
        id="my-data-table"
        type="normal"
        columns={columns}
        data={data || []}
        onSortIconClick={handleSort}
        currentPage={paginationConfig.pageNumber}
        totalPageCount={paginationConfig.totalPages}
        pagination={true}
        totalRocords={paginationConfig.totalElements}
        handleChangePage={handleChangePage}
        recordsPerPage={paginationConfig.pageSize}
        paginationTotalRecorsMessage={t('orgManagement.results')}
        paginationRecordsPerPageMessage={t('orgManagement.per_page')}
        progressPending={isFetching}
        progressComponent={
          <div
            style={{
              alignItems: 'center',
              border: '1px solid #ccc',
              display: 'flex',
              height: '350px',
              justifyContent: 'center'
            }}>
            <Loader variant="circular" />
          </div>
        }
      />
    </React.Fragment>
  );
}
