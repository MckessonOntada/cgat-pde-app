import React, { useState } from 'react';
import { Button, CustomDataTable, Loader } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as CrossIcon } from '../../../../assets/svg/cross-red.svg';
import { usePendingPayments } from '../../context/PendingPaymentsContext';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FormattedNumber } from 'react-intl';
import dayjs from 'dayjs';

export default function PendingPaymentTable() {
  const { t } = useTranslate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError } = usePendingPayments();

  const columns = [
    {
      id: 'confirmationNo',
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
      id: 'paymentMethod',
      name: t('paymentInvoices.history.table.paymentMethod'),
      selector: (row) => row.paymentMethod,
      minWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props.paymentMethod}</div>
    },
    {
      id: 'paymentInitiationDate',
      name: t('paymentInvoices.history.table.paymentInitiationDate'),
      selector: (row) => row.paymentInitiationDate,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      cell: (props) => (
        <EclipsesTextcss
          className="cellEllipse"
          str={dayjs(props.paymentInitiationDate, 'DD/MM/YYYY')?.format('MM/DD/YYYY') || '-'}
          maxWidth={240}
        />
      )
    },
    {
      id: 'authorizedAmt',
      name: t('pendingPayments.table.totalAuthorizedPaymentAmt'),
      selector: (row) => row.authorizedAmt,
      minWidth: '200px',
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.authorizedAmt} style="currency" currency="USD" />
        </div>
      ),
      right: true
    }
    // {
    //   name: t('paymentInvoices.history.table.Actions'),
    //   minWidth: '144px',
    //   sortable: false,
    //   wrap: true,
    //   cell: (props) => (
    //     <Button className="cancel-button-control" variant="tertiary" Icon={() => <CrossIcon />} onClick={() => {}} size="md">
    //       {t('pendingPayments.table.cancelPayment')}
    //     </Button>
    //   )
    // }
  ];
  const handleSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.id) applySort({ sortBy: selectedColumn.id, sortOrder: sortDirection });
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
        noDataComponent={
          <EmptyDataTable
            isLoading={isFetching}
            error={isError ? 'Something went wrong! Please try again' : null}
            image={EmptyDataImage}
            heading={t('pendingPayments.table.bankAccount.emptyData')}
            description={t('paymentInvoices.history.table.emptyDataDescription')}
          />
        }
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
