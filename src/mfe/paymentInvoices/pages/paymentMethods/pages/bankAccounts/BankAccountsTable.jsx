import React, { useState } from 'react';
import DataTable from '@src/components/dataTable/DataTable';
import { Loader } from '@mckesson/mcp-component-library';
// import { PaymentInvoicesData } from '@src/mfe/paymentInvoices/mockData/PaymentInvoicesData';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { usePaymentMethods } from '@src/mfe/paymentInvoices/context/PaymentMethodsContext';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FinanceUtils } from '@src/util/FinanceUtil';

export default function PaymentHistoryTable() {
  const { t } = useTranslate();
  const { bankAccountsData, isFetching, isError } = usePaymentMethods();

  const columns = [
    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.bankName'),
      selector: (row) => `${row.name}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}>{`${props.name}`}</Link>
        </div>
      )
    },
    {
      id: 'purchaseOrderNumber',
      name: t('paymentInvoices.paymentMethods.table.bankAccount.routingNumber'),
      selector: () => {},
      minWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{''}</div>
    },
    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.bankAccNumber'),
      selector: (row) => row.accountNumber,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      cell: (props) => <EclipsesTextcss className="cellEllipse" str={FinanceUtils.maskBankNumber(props.accountNumber)} maxWidth={240} />
    },

    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.bankCountry'),
      selector: () => {},
      minWidth: '144px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{''}</div>
    },
    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.companyCode'),
      selector: () => {},
      minWidth: '168px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{''}</div>
    }
  ];

  const handleSortClick = (column, sortDirection) => {
    console.log('column', filteredData, column);
    const sortedData = filteredData.sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[column.selector] > b[column.selector] ? 1 : -1;
      } else {
        return a[column.selector] < b[column.selector] ? 1 : -1;
      }
    });
    // setFilteredData([...sortedData]);
  };

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        rows={bankAccountsData}
        responsive
        handleSortClick={handleSortClick}
        progressPending={isFetching}
        noDataComponent={
          <EmptyDataTable
            isLoading={isFetching}
            error={isError ? 'Something went wrong! Please try again' : null}
            image={EmptyDataImage}
            heading={t('paymentInvoices.invoice.table.emptyData')}
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
