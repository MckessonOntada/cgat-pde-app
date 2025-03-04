import React from 'react';
import { Loader, Button } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as PDFicon } from '../../../../assets/svg/office-file-pdf.svg';
import { useCustomerStatements } from '../../context/CustomerStatementsContext';
import { FormattedNumber } from 'react-intl';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import dayjs from 'dayjs';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import ApiRoutes from '@src/api/ApiRoutes';
import { useAccountContext } from '../../context/AccountContext';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';

export default function CustomerStatementTable() {
  const { t } = useTranslate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError, exportPDF } = useCustomerStatements();
  const { selectedAccount } = useAccountContext();
  const showCardView = useResponsiveView();
  const columns = [
    {
      id: 'accountNumber',
      name: t('paymentInvoices.CS.table.accountnumber'),
      selector: (row) => `${row.accountNumber}`,
      minWidth: '140px',
      sortable: true,
      wrap: true,
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      mobileStyles: { fontWeight: 'var(--brand-font-weight-700)' },
      cell: (props) => props.accountNumber
    },
    {
      id: 'billNumber',
      name: t('paymentInvoices.CS.table.billNumber'),
      selector: (row) => `${row.docNo}`,
      sortable: true,
      wrap: true,
      minWidth: '140px',
      showInMobileHeader: true,
      cardHeader: true,
      mobileStyles: { fontSize: 'var(--brand-font-size--default)' },
      cell: (props) => props.docNo
    },
    {
      id: 'date',
      name: t('paymentInvoices.CS.table.date'),
      selector: (row) => row.date,
      width: '100px',
      sortable: true,
      wrap: true,
      cell: (props) => dayjs(props.date, 'DD/MM/YYYY')?.format('MM/DD/YYYY') || '-'
    },
    {
      id: 'statementBalance',
      name: t('paymentInvoices.CS.table.statementBalance'),
      selector: (row) => row.statementBalance,
      sortable: true,
      wrap: true,
      maxWidth: '220px',
      cell: (props) => (
        <div className="status-container align-items-right">
          <FormattedNumber value={props?.statementBalance} style="currency" currency="USD" />
        </div>
      ),
      right: true
    },
    {
      name: t('paymentInvoices.history.table.Actions'),
      selector: (row) => row,
      maxWidth: '150px',
      sortable: true,
      wrap: true,
      isAction: true,
      isContextMenu: false,
      cell: (props) => (
        <Button
          className="back-button-control"
          variant="tertiary"
          Icon={() => <PDFicon />}
          onClick={() => {
            exportPDF(
              `${ApiRoutes.EXPORT_CUSTOMER_STATEMENTS({ docNo: props.docNo, accountNumber: selectedAccount?.accountNumber })}`,
              {
                companyCode: selectedAccount?.companyCode,
                salesOrg: selectedAccount?.salesOrg,
                payerAccountNumber: selectedAccount?.accountNumber,
                documentDate: props?.date
              },
              'pdf'
            );
          }}
          size="md">
          {t('paymentInvoices.CS.table.exportPdf')}
        </Button>
      )
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
        showCardView={showCardView}
        defaultExpandedCardView={false}
        noDataComponent={
          <EmptyDataTable
            isLoading={isFetching}
            // error={isError ? 'Something went wrong! Please try again' : null}
            image={EmptyDataImage}
            heading={t('paymentInvoices.CS.table.emptyData')}
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
