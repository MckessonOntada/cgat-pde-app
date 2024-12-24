import React, { useState } from 'react';
import { Badge, Button, CustomDataTable, Loader } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as PDFicon } from '../../../../assets/svg/office-file-pdf.svg';
import { usePaymentCredits } from '../../context/PaymentsCreditsContext';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FormattedNumber } from 'react-intl';

export default function CreditsTable() {
  const { t } = useTranslate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError } = usePaymentCredits();

  const columns = [
    {
      id: 'billNumber',
      name: t('paymentInvoices.history.table.billNumber'),
      selector: (row) => `${row.billNumber}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}>{`${props.billNumber}`}</Link>
        </div>
      )
    },
    {
      id: 'soldToSite',
      name: t('paymentInvoices.history.table.SoldToSite'),
      selector: () => {},
      minWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props.soldToSite}</div>
    },
    {
      id: 'description',
      name: t('paymentInvoices.credits.table.description'),
      selector: (row) => row.description,
      minWidth: '144px',
      sortable: true,
      wrap: true,
      cell: (props) => props.description
    },
    {
      id: 'billDate',
      name: t('paymentInvoices.credits.table.validfrom'),
      selector: (row) => row.billDate,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      cell: (props) => <EclipsesTextcss className="cellEllipse" str={props.billDate} maxWidth={240} />
    },

    {
      id: 'billAmount',
      name: t('paymentInvoices.credits.table.amount'),
      selector: (row) => row.billAmount,
      minWidth: '144px',
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div className="status-container">
          <FormattedNumber value={props?.billAmount} style="currency" currency="USD" />
        </div>
      )
    }
    // {
    //   name: t('paymentInvoices.history.table.Actions'),
    //   selector: (row) => row.totalAuthorizedPaymentAmt,
    //   minWidth: '144px',
    //   sortable: true,
    //   wrap: true,

    //   cell: (props) => (
    //     <Button className="back-button-control" variant="tertiary" Icon={() => <PDFicon />} onClick={() => {}} size="md">
    //       {t('paymentInvoices.credits.table.downloadPdf')}
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
            heading={t('paymentInvoices.credits.table.emptyData')}
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
