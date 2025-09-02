import React, { useState } from 'react';
import { Badge, Button, Loader, MenuList, Tooltip } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { usePaymentInvoices } from '../../context/PaymentsInvoicesContext';
import { FormattedNumber } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as ActionIcon } from '@src/assets/image/actionIcon.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { DUE_STATUS } from './InvoiceConstants';
import { PATHS } from '../../routes';
import CommonUtils, { checkIsDataFiltered } from '@src/util/CommonUtils';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { useAccountContext } from '../../context/AccountContext';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import OrderService from '@src/api/commonService/OrderService';
import { useMutation } from 'react-query';
import useAlert from '@src/hooks/useAlert';
import ApiRoutes from '@src/api/ApiRoutes';
import HttpResourceService, { httpVerb } from '@src/api/HttpResourceService';

export default function InvoicesTable() {
  const { t } = useTranslate();
  const [includeinvoiceData, setIncludeinvoiceData] = useState([]);
  const navigate = useNavigate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError, exportExcel, filterConfig } = usePaymentInvoices();
  const { showAlert } = useAlert();
  const showCardView = useResponsiveView();
  const { selectedAccount } = useAccountContext();
  const alertContainerId = 'summary-alert-container';
  const MAX_SELECTION = 20;
  const isDataFiltered = React.useMemo(() => {
    return checkIsDataFiltered(filterConfig);
  }, [filterConfig]);
  const { mutate: handleOnClickOrderId } = useMutation(
    async (orderId) => {
      return OrderService.getBackendOrderId(orderId);
    },
    {
      onSuccess: (data) => {
        navigate(`/orders/${data}/summary`, {
          state: {
            backToInvoiceListing: true
          }
        });
      },
      onError: (error) => {
        const { response } = error;
        let errorMsg = response?.data?.message || 'Error fetching order details';
        showAlert({
          description: t('errors.default'),
          type: 'error',
          anchorEl: 'summary-alert-container'
        });
      }
    }
  );

  const { mutate: handleDownload } = useMutation(
    async (row) => {
      const url = `${ApiRoutes.INVOICES_CREDITS_DETAILS(selectedAccount?.id, row.billNumber)}/details-pdf`;
      const body = {
        fiscalYear: row.fiscalYear,
        companyCode: selectedAccount.companyCode,
        documentNo: row.billNumber
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
      const filename = match ? match[1] : 'invoice.pdf';

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
      onError: () => {
        showAlert({
          description: t('errors.default'),
          type: 'error',
          anchorEl: alertContainerId
        });
      }
    }
  );
  const isAllChecked = (data, selectedData, dataKey) => {
    return data.every((item) => selectedData.some((selected) => selected[dataKey] === item[dataKey]));
  };

  const columns = [
    {
      id: 'checkbox',
      name: (() => {
        const headerCheckbox = renderTableCheckBox(
          { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
          data,
          'billNumber',
          paginationConfig,
          includeinvoiceData,
          setIncludeinvoiceData,
          false,
          false,
          false,
          MAX_SELECTION
        );
        const isHeaderDisabled = includeinvoiceData.length >= MAX_SELECTION && !isAllChecked(data, includeinvoiceData, 'billNumber');
        return isHeaderDisabled ? (
          <Tooltip body={t('paymentInvoices.invoice.count.text')} placement="right">
            <span>{headerCheckbox}</span>
          </Tooltip>
        ) : (
          headerCheckbox
        );
      })(),
      sortable: false,
      cell: (row, index) => {
        const isDisabled = includeinvoiceData.length >= MAX_SELECTION && !includeinvoiceData.some((item) => item.billNumber === row.billNumber);
        const rowCheckBox = renderTableCheckBox(
          row,
          data,
          'billNumber',
          paginationConfig,
          includeinvoiceData,
          setIncludeinvoiceData,
          false,
          false,
          isDisabled,
          MAX_SELECTION
        );
        return isDisabled ? (
          <Tooltip body={t('paymentInvoices.invoice.count.text')} placement="right">
            <span>{rowCheckBox}</span>
          </Tooltip>
        ) : (
          rowCheckBox
        );
      },

      selector: (row) => row.MRN,
      width: '40px',
      showInMobileHeader: true,
      isSelectable: true,
      omit: !CommonUtils.enableReviewAndPay(selectedAccount)
    },
    {
      name: t('paymentInvoices.history.table.invoiceNumber'),
      id: 'billNumber',
      selector: (row) => `${row.billNumber}`,
      sortable: true,
      wrap: true,
      minWidth: '166px',
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
            to={`/record/${PATHS.invoices}/${props?.billNumber}/details`}
            state={{
              invoices: [...[], props],
              selectedPayToAcc: selectedAccount
            }}>{`${props?.billNumber || ''}`}</Link>
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.residualInvoiceNumber'),
      id: 'referenceDocumentNumber',
      selector: (row) => `${row.invoiceReference}`,
      minWidth: '175px',
      cell: (props) => <EclipsesTextcss str={props.invoiceReference} maxWidth={170} />
    },
    {
      name: t('labels.orderId'),
      id: 'mckessonOrderId',
      selector: (row) => `${row.mckessonOrderId}`,
      maxWidth: '140px',
      cell: (props) => (
        <Link className="MCP-table-link" onClick={() => handleOnClickOrderId(props.mckessonOrderId)}>
          <EclipsesTextcss str={props.mckessonOrderId} maxWidth={170} />
        </Link>
      )
    },
    {
      name: t('labels.soldToAccountName'),
      id: 'soldToName',
      selector: (row) => `${row.soldToName}`,
      maxWidth: '180px',
      cell: (props) => <EclipsesTextcss str={props.soldToName} maxWidth={170} />
    },
    {
      name: t('paymentInvoices.history.table.invoiceDate'),
      selector: (row) => row.billDate,
      sortable: true,
      id: 'billDate',
      width: '120px',
      cell: (props) => CommonUtils.convertDateStringFormat(props.billDate, 'MM/DD/YYYY', 'DD/MM/YYYY')
    },
    {
      name: t('paymentInvoices.history.table.DueDate'),
      selector: (row) => row.dueDate,
      width: '125px',
      sortable: true,
      id: 'dueDate',
      cell: (props) => CommonUtils.convertDateStringFormat(props?.dueDate, 'MM/DD/YYYY', 'DD/MM/YYYY')
    },
    {
      name: t('paymentInvoices.history.table.invoiceAmount'),
      selector: (row) => row?.billAmount,
      minWidth: '155px',
      sortable: true,
      right: true,
      id: 'billAmount',
      cell: (props) => (
        <div className="cellEllipse align-items-right ">
          <FormattedNumber value={props?.billAmount || 0} style="currency" currency="USD" />
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.OpenAmount'),
      selector: (row) => row.openAmount,
      minWidth: '155px',
      sortable: true,
      id: 'openAmount',
      cell: (props) => (
        <div className="cellEllipse align-items-right ">
          <FormattedNumber value={props?.openAmount || 0} style="currency" currency="USD" />
        </div>
      ),
      right: true
    },
    {
      name: <span className="statusCenter">{t('paymentInvoices.history.table.status')}</span>,
      selector: (row) => row.status,
      minWidth: '195px',
      sortable: true,
      center: true,
      wrap: true,
      id: 'status',
      showInMobileHeader: true,
      cardStatus: true,
      cell: (props) => (
        <div className="status-container">
          {props.status ? (
            <Badge
              text={DUE_STATUS[props.status]?.label}
              customStyle={{
                backgroundColor: `${DUE_STATUS[props.status]?.color}`
              }}
            />
          ) : (
            '-'
          )}
        </div>
      )
    },

    {
      name: t('paymentInvoices.history.table.Actions'),
      width: '100px',

      id: 'actions',
      wrap: true,
      showInMobileHeader: true,
      isAction: true,
      isContextMenu: true, // If it is already a context menu
      cell: (props) => (
        <MenuList
          menuIcon={<IconEllipsis key={'menu-list-invoice-actions'} />}
          handleSelect={(value) => handleOnOptionSelection(value, props)}
          options={[
            {
              label: t('paymentInvoices.Actions.payment'),
              value: 'payment'
            },
            ...(props.isPdfAvailable
              ? [
                  {
                    label: t('paymentInvoices.credits.table.downloadPdf'),
                    value: 'exportPDF'
                  }
                ]
              : [])
          ]}
          aria-label="invoice options"
          size="md"
        />
      ),
      omit: !CommonUtils.enableReviewAndPay(selectedAccount)
    }
  ];

  const handleOnOptionSelection = (value, row) => {
    if (value == 'payment') {
      navigate(`/record/invoices/reviewPayments`, {
        state: {
          invoices: [row],
          reviewPay: true,
          selectedPayToAcc: selectedAccount
        }
      });
    } else {
      handleDownload(row);
    }
  };

  const handleSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.id) applySort({ sortBy: selectedColumn.id, sortOrder: sortDirection });
  };

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };
  return (
    <React.Fragment>
      <TableHeading
        heading={t('paymentInvoices.table.invoiceHeading')}
        controls={
          <Button variant="secondary" onClick={() => exportExcel()} disabled={data.length === 0} size="sm">
            {t('paymentInvoices.CS.ExportExcel')}
          </Button>
        }
        secondaryView={includeinvoiceData.length > 0}
        secondaryViewHeading={`${includeinvoiceData.length} ${t('paymentInvoices.history.table.selectedAccount')}`}
        secondaryViewControls={
          <Button
            variant="secondary"
            onClick={() => {
              navigate(`/record/invoices/reviewPayments`, {
                state: {
                  invoices: includeinvoiceData,
                  reviewPay: true,
                  selectedPayToAcc: selectedAccount
                }
              });
            }}
            size="sm">
            {t('paymentInvoices.Details.ReviewAndPay')}
          </Button>
        }
      />
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
        isMultipleRowSelect={true}
        selectedData={includeinvoiceData}
        setSelectedData={setIncludeinvoiceData}
        noDataComponent={
          <EmptyDataTable
            isLoading={isFetching}
            // error={isError ? 'Something went wrong! Please try again' : null}
            image={EmptyDataImage}
            heading={isDataFiltered ? t('errors.messages.noRecordsFound') : t('paymentInvoices.invoice.table.emptyData')}
            description={!isDataFiltered && t('paymentInvoices.history.table.emptyDataDescription')}
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
        maxSelection={MAX_SELECTION}
      />
    </React.Fragment>
  );
}
