import React from 'react';
import { Link } from 'react-router-dom';
import EmptyDataTable from '@src/components/EmptyTable';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { useTranslate } from '@src/translations/useTranslation';
import { usePaymentMethods } from '@src/mfe/finance-management/context/PaymentMethodsContext';
import { Loader } from '@mckesson/mcp-component-library';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FinanceUtils } from '@src/util/FinanceUtil';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';

export default function PaymentHistoryTable() {
  const { t } = useTranslate();
  const { bankAccountsData, isFetching, isError, applyBankSort, bankPaginationConfig, setBanksTablePageNumber } = usePaymentMethods();
  const showCardView = useResponsiveView();
  const columns = [
    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.bankName'),
      selector: (row) => `${row.name}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      showInMobileHeader: true,
      showColumnNameInHeader: true,
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
      showInMobileHeader: true,
      cardHeader: true,
      mobileStyles: { fontWeight: 'var(--brand-font-weight-700)' },
      cell: (props) => <EclipsesTextcss className="cellEllipse" str={FinanceUtils.maskBankNumber(props.accountNumber)} maxWidth={240} />
    },

    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.bankCountry'),
      selector: () => {},
      maxWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <EclipsesTextcss src={' '} maxWidth={150} />
    },
    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.companyCode'),
      selector: () => {},
      maxWidth: '180px',
      sortable: true,
      wrap: true,
      cell: (props) => <EclipsesTextcss src={' '} maxWidth={170} />
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
      showCardView={showCardView}
      defaultExpandedCardView={false}
      noDataComponent={
        <EmptyDataTable
          isLoading={isFetching}
          // error={isError ? 'Something went wrong! Please try again' : null}
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
          }}>
          <Loader variant="circular" />
        </div>
      }
    />
  );
}
