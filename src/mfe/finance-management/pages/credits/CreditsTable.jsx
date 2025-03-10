import React, { useState } from 'react';
import { Loader } from '@mckesson/mcp-component-library';
import { Link, useLocation } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as PDFicon } from '../../../../assets/svg/office-file-pdf.svg';
import { usePaymentCredits } from '../../context/PaymentsCreditsContext';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FormattedNumber } from 'react-intl';
import { PATHS } from '../../routes';
import CommonUtils from '@src/util/CommonUtils';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';

export default function CreditsTable(props) {
  const { t } = useTranslate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError } = usePaymentCredits();
  const { selectedRows, setSelectedRows, selectableRows } = props;
  const location = useLocation();
  const { state } = location;
  const showCardView = useResponsiveView();

  const columns = [
    {
      id: 'checkbox',
      name: renderTableCheckBox(
        { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
        data,
        'billNumber',
        paginationConfig,
        selectedRows,
        setSelectedRows
      ),
      sortable: false,
      cell: (row, index) => renderTableCheckBox(row, data, 'billNumber', paginationConfig, selectedRows, setSelectedRows),
      selector: (row) => row.MRN,
      width: '48px',
      omit: !selectableRows,
      showInMobileHeader: true
    },
    {
      id: 'billNumber',
      name: t('paymentInvoices.history.table.billNumber'),
      selector: (row) => `${row.billNumber}`,
      sortable: true,
      wrap: true,
      minWidth: '120px',
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: 'var(--brand-color-primary)', fontWeight: '600', textDecoration: 'none' }}
            to={`/record/${PATHS.credits}/${props?.billNumber}/details`}
            state={{ ...state }}>
            {`${props?.billNumber}`}
          </Link>
        </div>
      )
    },
    {
      id: 'soldToSite',
      name: t('paymentInvoices.history.table.SoldToSite'),
      selector: () => {},
      minWidth: '180px',
      sortable: true,
      wrap: true,
      showInMobileHeader: true,
      cardHeader: true,
      mobileStyles: { fontWeight: 'var(--brand-font-weight-700)' },
      cell: (props) => <div>{props?.soldToSite || '-'}</div>
    },
    {
      id: 'description',
      name: t('paymentInvoices.credits.table.description'),
      selector: (row) => row.description,
      minWidth: '340px',
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div>
          <EclipsesTextcss str={props?.description} maxWidth={280} />
        </div>
      )
    },
    {
      id: 'dueDate',
      name: t('paymentInvoices.credits.table.validfrom'),
      selector: (row) => row.dueDate,
      sortable: true,
      wrap: true,
      width: '140px',
      cell: (props) => CommonUtils.convertDateStringFormat(props.dueDate, 'MM/DD/YYYY', 'DD/MM/YYYY')
    },
    {
      id: 'billAmount',
      name: selectableRows ? t('paymentInvoices.credits.table.billamount') : t('paymentInvoices.credits.table.amount'),
      selector: (row) => row.billAmount,
      maxWidth: '240px',
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div className="status-container align-items-right">
          <FormattedNumber value={props?.billAmount} style="currency" currency="USD" />
        </div>
      ),
      right: true
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
        showCardView={showCardView}
        defaultExpandedCardView={false}
        noDataComponent={
          <EmptyDataTable
            isLoading={isFetching}
            // error={isError ? 'Something went wrong! Please try again' : null}
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
            }}>
            <Loader variant="circular" />
          </div>
        }
      />
    </React.Fragment>
  );
}
