import React, { useState } from 'react';
import { Loader, Button } from '@mckesson/mcp-component-library';
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
import { useMutation } from 'react-query';
import { useAccountContext } from '../../context/AccountContext';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';
import ApiRoutes from '@src/api/ApiRoutes';

export default function CreditsTable(props) {
  const { t } = useTranslate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError, fileteredData } = usePaymentCredits();
  const { selectedRows, setSelectedRows, selectableRows, disableSelection } = props;
  const location = useLocation();
  const { state } = location;
  const showCardView = useResponsiveView();
  const { selectedAccount } = useAccountContext();

  const { mutate: handlePdfDownload } = useMutation(
    async (props) => {
      const url = `${ApiRoutes.INVOICES_CREDITS_DETAILS(selectedAccount?.id, props.billNumber)}/details-pdf`;
      const body = {
        fiscalYear: props.fiscalYear,
        companyCode: selectedAccount.companyCode,
        documentNo: props.referenceDocumentNumber
      };
      const headers = {
        accept: 'application/json, text/plain, */*',
        'content-type': 'application/json;charset=UTF-8'
      };
      const response = await HttpResourceService.callRest(url, httpVerb.POST, body, headers, null, null, null, 'blob');

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = downloadUrl;

      const disposition = response.headers['content-disposition'];
      const match = disposition?.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : 'credit.pdf';

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    },
    {
      onSuccess: () => {
        showAlert({
          description: t('paymentInvoices.table.column.pdfDownload'),
          type: 'success',
          anchorEl: alertContainerId
        });
      },
      onError: (error) => {
        showAlert({
          description: t('paymentInvoices.table.column.pdfDownloadError'),
          type: 'error',
          anchorEl: alertContainerId
        });
      }
    }
  );

  const columns = [
    {
      id: 'checkbox',
      name: renderTableCheckBox(
        { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
        data,
        'billNumber',
        paginationConfig,
        selectedRows,
        setSelectedRows,
        true,
        false
      ),
      sortable: false,
      cell: (row, index) => {
        const isdisable = disableSelection && !selectedRows?.some((r) => r?.billNumber === row?.billNumber);
        return renderTableCheckBox(row, data, 'billNumber', paginationConfig, selectedRows, setSelectedRows, true, false, isdisable);
      },
      selector: (row) => row.MRN,
      width: '48px',
      omit: !selectableRows,
      showInMobileHeader: true
    },
    {
      id: 'billNumber',
      name: t('paymentInvoices.history.table.invoiceNumber'),
      selector: (row) => `${row.billNumber}`,
      sortable: true,
      wrap: true,
      minWidth: '220px',
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{
              color: 'var(--brand-color-primary)',
              fontWeight: '600',
              textDecoration: 'none'
            }}
            to={`/record/${PATHS.credits}/${props?.billNumber}/details`}
            state={{ ...state, selectedCredit: [...[], props] }}>
            {`${props?.billNumber}`}
          </Link>
        </div>
      )
    },
    {
      id: 'soldToSite',
      name: t('paymentInvoices.table.column.soldToAccount'),
      selector: () => {},
      minWidth: '220px',
      sortable: true,
      wrap: true,
      showInMobileHeader: true,
      cardHeader: true,
      mobileStyles: { fontWeight: 'var(--brand-font-weight-700)' },
      cell: (props) => <div>{props?.soldToSite || '-'}</div>
    },
    {
      id: 'dueDate',
      name: t('paymentInvoices.credits.table.credit.date'),
      selector: (row) => row.dueDate,
      sortable: true,
      wrap: true,
      width: '140px',
      cell: (props) => CommonUtils.convertDateStringFormat(props.dueDate, 'MM/DD/YYYY', 'DD/MM/YYYY')
    },
    {
      id: 'openAmount',
      name: selectableRows ? t('paymentInvoices.history.table.invoiceAmount') : t('paymentInvoices.table.column.creditAmount'),
      selector: (row) => row.openAmount,
      maxWidth: '240px',
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div className="status-container align-items-right">
          <FormattedNumber value={props?.openAmount} style="currency" currency="USD" />
        </div>
      ),
      right: true
    },
    {
      name: t('paymentInvoices.history.table.Actions'),
      selector: (row) => row.totalAuthorizedPaymentAmt,
      minWidth: '144px',
      sortable: true,
      wrap: true,

      cell: (props) => (
        <Button
          disabled={!props.isPdfAvailable}
          className="back-button-control"
          variant="tertiary"
          Icon={() => <PDFicon />}
          onClick={() => {
            handlePdfDownload(props);
          }}
          size="sm">
          {t('paymentInvoices.credits.table.downloadPdf')}
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
            heading={!fileteredData ? t('paymentInvoices.credits.table.emptyData') : t('errors.messages.noRecordsFound')}
            description={!fileteredData && t('paymentInvoices.history.table.emptyDataDescription')}
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
