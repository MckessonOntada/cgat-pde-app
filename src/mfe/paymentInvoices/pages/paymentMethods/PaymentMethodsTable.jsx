import React, { useState } from 'react';
import DataTable from '@src/components/dataTable/DataTable';
import { Badge, CustomDataTable, Loader } from '@mckesson/mcp-component-library';
import { PaymentHistoryData } from '../../mockData/PaymentHistoryData';
import { Link } from 'react-router-dom';
import FloatingDrawer from '../../../../components/floating-drawer';
import PaymentDetails from './PaymentDetails';
import { useTranslate } from '@src/translations/useTranslation';
import { usePaymentMethods } from '../../context/PaymentMethodsContext';

export default function PaymentMethodsTable() {
  const { t } = useTranslate();
  const [filteredData, setFilteredData] = useState(PaymentHistoryData);
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, paginationConfig, setPageNumber, applySort } = usePaymentMethods();
  const columns = [
    {
      name: t('paymentInvoices.history.table.confirmationNumber'),
      selector: (row) => `${row.ConfirmationNumber}`,
      sortable: true,
      sortKey: 'ConfirmationNumber',
      wrap: true,
      cell: (props) => (
        <div className="cellEllipse" onClick={() => setIsOpen(true)}>
          <Link style={{ color: '#007bff', fontWeight: '600' }}>{`${props.ConfirmationNumber}`}</Link>
        </div>
      )
    },
    {
      id: 'PurchaseOrderNumber',
      name: t('paymentInvoices.history.table.purchaseOrderNumber'),
      sortable: true,
      sortKey: 'PurchaseOrderNumber',
      selector: () => {},
      cell: (props) => <div>{props.PurchaseOrderNumber}</div>
    },
    {
      name: t('paymentInvoices.history.table.paymentMethod'),
      selector: (row) => {},
      wrap: true,
      sortable: true,
      sortKey: 'PaymentMethod',
      width: '20%',
      cell: (props) => <div className="cellEllipse">{props.PaymentMethod}</div>
    },

    {
      name: t('paymentInvoices.history.table.paymentInitiationDate'),
      selector: (row) => {},
      width: '20%',
      sortable: true,
      sortKey: 'PaymentInitiationDate',
      cell: (props) => <div className="cellEllipse">{props.PaymentInitiationDate}</div>
    },
    {
      name: t('paymentInvoices.history.table.paymentStatus'),
      selector: 'paymentStatus',
      sortable: true,
      sortKey: 'PaymentStatus',
      cell: (props) => <div className="status-container">{props.PaymentStatus == 'COMPLETED' ? <Badge text="COMPLETED" type="success" /> : <Badge text="IN PROCESS" type="info-default" />}</div>
    },
    {
      name: <div className="align-items-right">{t('paymentInvoices.history.table.totalAuthorizedPaymentAmt')}</div>,
      selector: (row) => {},
      width: '20%',
      sortable: true,
      sortKey: 'TotalAuthorizedPaymentAmt',
      cell: (props) => <div className="align-items-right">${props.TotalAuthorizedPaymentAmt}</div>
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
        progressPending={isLoading}
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
        // isAdmin={true}
        // noDataComponent={<EmptyDataTable isLoading={isLoading} error={isError ? 'Something went wrong! Please try again' : null} image={EmptyDataImage} heading={t('orgManagement.add.label')} description={t('orgManagement.empty_table.description')} />}
      />

    </React.Fragment>
  );
}
