import React, { useState } from 'react';
import DataTable from '@src/components/dataTable/DataTable';
import { Badge, CustomDataTable, Loader } from '@mckesson/mcp-component-library';
import { PaymentHistoryData } from '../../mockData/PaymentHistoryData';
import { Link } from 'react-router-dom';
import FloatingDrawer from '../../../../components/floating-drawer';
import PaymentDetails from './PaymentDetails';
import { useTranslate } from '@src/translations/useTranslation';
import { usePaymentHistory } from '../../context/PaymentHistoryContext';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FormattedNumber } from 'react-intl';
import dayjs from 'dayjs';
import { PATHS } from '../../routes';

const PAYMENT_STATUS = {
  PENDING: { label: 'Pending', color: 'warning' },
  PROCESSED: { label: 'Processed', color: 'success' },
  FAILED: { label: 'Failed', color: 'error' }
};

export default function PaymentHistoryTable() {
  const { t } = useTranslate();
  // const [isOpen, setIsOpen] = useState(false);

  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError } = usePaymentHistory();
  const columns = [
    {
      id: 'confirmationNo',
      name: t('paymentInvoices.history.table.confirmationNumber'),
      selector: (row) => `${row.confirmationNo}`,
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: '#007bff', fontWeight: '600' }}
            to={`/record/${PATHS.paymentHistory}/${props?.confirmationNo}/confirmation`}
            state={{ ...props }}>{`${props?.confirmationNo}`}</Link>
        </div>
      )
    },
    {
      id: 'purchaseOrderNo',
      name: t('paymentInvoices.history.table.purchaseOrderNumber'),
      sortable: true,
      selector: (row) => `${row.purchaseOrderNo}`,
      cell: (props) => <div>{props.purchaseOrderNo}</div>
    },
    {
      id: 'paymentMethod',
      name: t('paymentInvoices.history.table.paymentMethod'),
      selector: (row) => `${row.paymentMethod}`,
      wrap: true,
      sortable: true,
      width: '20%',
      cell: (props) => <div className="cellEllipse">{props.paymentMethod}</div>
    },

    {
      id: 'paymentInitiationDate',
      name: t('paymentInvoices.history.table.paymentInitiationDate'),
      selector: (row) => `${row.paymentInitiationDate}`,
      width: '20%',
      sortable: true,
      cell: (props) => <div className="cellEllipse">{dayjs(props.paymentInitiationDate, 'DD/MM/YYYY')?.format('MM/DD/YYYY') || '-'}</div>
    },
    {
      id: 'paymentStatus',
      name: t('paymentInvoices.history.table.paymentStatus'),
      selector: (row) => `${row.paymentStatus}`,
      sortable: true,
      cell: (props) => (
        <div className="status-container">
          {PAYMENT_STATUS[props?.paymentStatus.toUpperCase()] ? (
            <Badge
              text={PAYMENT_STATUS[props?.paymentStatus.toUpperCase()].label}
              type={`${PAYMENT_STATUS[props?.paymentStatus.toUpperCase()].color}-high`}
            />
          ) : (
            '-'
          )}
        </div>
      )
    },
    {
      id: 'totalAuthorizedPaymentAmount',
      name: t('paymentInvoices.history.table.totalAuthorizedPaymentAmt'),
      selector: (row) => `${row.totalAuthorizedPaymentAmount}`,
      width: '20%',
      sortable: true,
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.totalAuthorizedPaymentAmount} style="currency" currency="USD" />
        </div>
      ),
      right: true
    }
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
            heading={t('paymentInvoices.history.table.emptyData')}
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
      {/* <FloatingDrawer open={isOpen} anchor="right" onClose={() => setIsOpen(false)}> */}
      {/* <PaymentDetails /> */}
      {/* </FloatingDrawer> */}
    </React.Fragment>
  );
}
