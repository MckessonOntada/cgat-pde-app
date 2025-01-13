import React from 'react';
import { Link } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { useTranslate } from '@src/translations/useTranslation';
import { usePaymentMethods } from '@src/mfe/finance-management/context/PaymentMethodsContext';
import { Loader, CustomDataTable } from '@mckesson/mcp-component-library';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FinanceUtils } from '@src/util/FinanceUtil';

export default function PaymentHistoryTable() {
  const { t } = useTranslate();
  const { bankAccountsData, isFetching, isError, applyBankSort, bankPaginationConfig, setBanksTablePageNumber } = usePaymentMethods();

  const columns = [
    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.bankName'),
      selector: (row) => `${row.name}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      cell: (props) => <div className="cellEllipse">{`${props.name}`}</div>
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

  const handleSortClick = (selectedColumn, sortDirection) => {
    if (selectedColumn.id) applyBankSort({ sortBy: selectedColumn.id, sortOrder: sortDirection });
  };

  const handleChangePage = (e, newPage) => {
    setBanksTablePageNumber(newPage);
  };

  return (
    <CustomDataTable
      id="bank-accounts-table"
      type="normal"
      columns={columns}
      data={bankAccountsData || []}
      responsive
      onSortIconClick={handleSortClick}
      currentPage={bankPaginationConfig.pageNumber}
      totalPageCount={bankPaginationConfig.totalPages}
      pagination={true}
      totalRocords={bankPaginationConfig.totalElements}
      handleChangePage={handleChangePage}
      recordsPerPage={bankPaginationConfig.pageSize}
      paginationTotalRecorsMessage={t('orgManagement.results')}
      paginationRecordsPerPageMessage={t('orgManagement.per_page')}
      progressPending={isFetching}
      noDataComponent={
        <EmptyDataTable
          isLoading={isFetching}
          error={isError ? 'Something went wrong! Please try again' : null}
          image={EmptyDataImage}
          heading={t('paymentInvoices.paymentMethods.table.bankAccount.emptyData')}
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
          }}
        >
          <Loader variant="circular" />
        </div>
      }
    />
  );
}
