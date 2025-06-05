import React, { useState } from 'react';
import { Badge, Button, Loader, MenuList } from '@mckesson/mcp-component-library';
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
import CommonUtils from '@src/util/CommonUtils';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import TableHeading from '@src/components/tableHeading/TableHeading';
import { useAccountContext } from '../../context/AccountContext';
import { renderTableCheckBox } from '@src/components/dataTableComponent/assets/constants/CustomTableConstants';
import { ReactComponent as IconEllipsis } from '@src/assets/svg/ellipsis.svg';

export default function InvoicesTable() {
  const { t } = useTranslate();
  const [includeinvoiceData, setIncludeinvoiceData] = useState([]);
  const navigate = useNavigate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError, exportExcel, fileteredData } = usePaymentInvoices();
  const showCardView = useResponsiveView();
  const { selectedAccount } = useAccountContext();

  const columns = [
    {
      id: 'checkbox',
      name: renderTableCheckBox(
        { id: 'ALL_ITEMS_' + paginationConfig.pageNumber },
        data,
        'billNumber',
        paginationConfig,
        includeinvoiceData,
        setIncludeinvoiceData
      ),
      sortable: false,
      cell: (row, index) => renderTableCheckBox(row, data, 'billNumber', paginationConfig, includeinvoiceData, setIncludeinvoiceData),
      selector: (row) => row.MRN,
      width: '50px',
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
      maxWidth: '140px',
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
      id: 'soldToSite',
      name: t('paymentInvoices.history.table.SoldToAccountNo'),
      selector: (row) => row.soldToSite,
      maxWidth: '140px',
      minWidth: '140px',
      sortable: true,
      showInMobileHeader: true,
      cardHeader: true,
      mobileStyles: { fontWeight: 'var(--brand-font-weight-700)' },
      cell: (props) => <div className="textCapitalize">{props?.soldToSite || '-'}</div>
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
      name: t('paymentInvoices.history.table.OpenAmount'),
      selector: (row) => row.openAmount,
      minWidth: '175px',
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
      name: t('paymentInvoices.history.table.invoiceAmount'),
      selector: (row) => row?.billAmount,
      minWidth: '175px',
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
            }
            // {
            //   label: t('paymentInvoices.Actions.exportPDF'),
            //   value: 'exportPDF'
            // }
          ]}
          aria-label="invoice options"
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
      // Export PDF API integration
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
            heading={!fileteredData ? t('paymentInvoices.invoice.table.emptyData') : t('errors.messages.noRecordsFound')}
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
