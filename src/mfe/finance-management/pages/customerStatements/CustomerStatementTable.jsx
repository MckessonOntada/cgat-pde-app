import React from 'react';
import { CustomDataTable, Loader, Button } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { ReactComponent as PDFicon } from '../../../../assets/svg/office-file-pdf.svg';
import { useCustomerStatements } from '../../context/CustomerStatementsContext';
import { FormattedNumber } from 'react-intl';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';

export default function CustomerStatementTable() {
  const { t } = useTranslate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError } = useCustomerStatements();
  const columns = [
    {
      id: 'billNumber',
      name: t('paymentInvoices.CS.table.billNumber'),
      selector: (row) => `${row.docNo}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}>{`${props.docNo}`}</Link>
        </div>
      )
    },
    {
      id: 'accountNumber',
      name: t('paymentInvoices.CS.table.accountnumber'),
      selector: (row) => `${row.accountNumber}`,
      minWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props.accountNumber}</div>
    },
    {
      id: 'date',
      name: t('paymentInvoices.CS.table.date'),
      selector: (row) => row.date,
      minWidth: '144px',
      sortable: true,
      wrap: true,
      cell: (props) => props.date
    },
    {
      id: 'statementBalance',
      name: t('paymentInvoices.CS.table.statementBalance'),
      selector: (row) => row.statementBalance,
      sortable: true,
      wrap: true,
      minWidth: '144px',
      cell: (props) => (
        <div className="status-container">
          <FormattedNumber value={props?.statementBalance} style="currency" currency="USD" />
        </div>
      )
    }
    // {
    //   name: t('paymentInvoices.history.table.Actions'),
    //   selector: () => {},
    //   minWidth: '144px',
    //   sortable: true,
    //   wrap: true,

    //   cell: (props) => (
    //     <Button className="back-button-control" variant="tertiary" Icon={() => <PDFicon />} onClick={() => {}} size="md">
    //       {t('paymentInvoices.CS.table.exportPdf')}
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
            }}
          >
            <Loader variant="circular" />
          </div>
        }
      />
    </React.Fragment>
  );
}
