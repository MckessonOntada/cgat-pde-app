import React from 'react';
import { Badge, Loader } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import { usePaymentHistory } from '../../context/PaymentHistoryContext';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { FormattedNumber } from 'react-intl';
import { PATHS } from '../../routes';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import useResponsiveView from '@src/hooks/useResponsiveView';
import { CustomDataTable } from '@src/components/dataTableComponent';
import CommonUtils from '@src/util/CommonUtils';
import { ReactComponent as ArrowAngleRight } from '@src/assets/svg/arrow-right.svg';

const PAYMENT_STATUS = {
  PROCESSED: { label: 'Processed', color: 'success' },
  PENDING: { label: 'Pending', color: 'info' },
  'IN PROCESS': { label: 'In Process', color: 'info' },
  SCHEDULED: { label: 'Scheduled', color: 'info' },
  'PENDING REVIEW': { label: 'Pending Review', color: 'info' },
  PROCESSING: { label: 'Processing', color: 'info' },
  FAILED: { label: 'Failed', color: 'error' },
  CANCELLED: { label: 'Cancelled', color: 'error' },
  'ON HOLD': { label: 'On Hold', color: 'warning' }
};

export default function PaymentHistoryTable() {
  const { t } = useTranslate();
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError, filterConfig, filteredData } = usePaymentHistory();
  const showCardView = useResponsiveView();
  const columns = [
    {
      id: 'confirmationNo',
      name: t('paymentInvoices.history.table.confirmationNumber'),
      selector: (row) => `${row.confirmationNo}`,
      sortable: true,
      minWidth: '180px',
      wrap: true,
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: 'var(--brand-color-primary)', fontWeight: '600', textDecoration: 'none' }}
            to={`/record/${PATHS.paymentHistory}/${props?.confirmationNo}/confirmation`}
            state={{ ...props, filterConfig }}>{`${props?.confirmationNo}`}</Link>
        </div>
      )
    },
    {
      id: 'billNo',
      name: t('paymentInvoices.history.table.invoiceNumber'),
      selector: (row) => row.invoices?.[0]?.billNo || '',
      minWidth: '240px',
      wrap: true,
      cell: (props) => {
        const invoices = props.invoices || [];
        const billNos = invoices.map((inv) => inv.billNo).filter((billNo) => billNo?.trim());
        const displayText =
          billNos.length === 1 ? billNos[0] : billNos.length === 2 ? billNos.join(', ') : billNos.length > 2 ? `${billNos[0]}, ${billNos[1]} & more` : '';
        return <EclipsesTextcss str={displayText} tooltip={billNos.join(', ')} maxWidth={230} />;
      }
    },
    {
      id: 'paymentMethod',
      name: t('paymentInvoices.history.table.paymentMethod'),
      selector: (row) => `${row.paymentMethod}`,
      wrap: true,
      sortable: true,
      maxWidth: '180px',
      cardHeader: true,
      showInMobileHeader: true,
      cell: (props) => <EclipsesTextcss str={props.paymentMethod} maxWidth={170} />
    },

    {
      id: 'paymentInitiationDate',
      name: t('paymentInvoices.history.table.paymentInitiationDate'),
      selector: (row) => `${row.paymentInitiationDate}`,
      maxWidth: '230px',
      sortable: true,
      cell: (props) => CommonUtils.convertDateStringFormat(props?.paymentInitiationDate, 'MM/DD/YYYY', 'DD/MM/YYYY')
    },
    // {
    //   id: 'payOn',
    //   name: t('paymentInvoices.history.table.PayOnDate'),
    //   selector: (row) => row.payOn,
    //   sortable: true,
    //   wrap: true,
    //   maxWidth: '145px',
    //   cell: (props) => CommonUtils.convertDateStringFormat(props.payOn, 'MM/DD/YYYY', 'DD/MM/YYYY')
    // },
    {
      id: 'paymentStatus',
      name: t('paymentInvoices.history.table.paymentStatus'),
      selector: (row) => `${row.paymentStatus}`,
      width: '150px',
      center: true,
      showInMobileHeader: true,
      cardStatus: true,
      cell: (props) => (
        <div className="status-container">
          {PAYMENT_STATUS[props?.paymentStatus.toUpperCase()] ? (
            <Badge
              customStyle={{ minWidth: '140px' }}
              text={PAYMENT_STATUS[props?.paymentStatus.toUpperCase()].label}
              type={`${PAYMENT_STATUS[props?.paymentStatus.toUpperCase()].color}-high`}
            />
          ) : (
            '-'
          )}
        </div>
      )
    },
    {
      id: 'totalAuthorizedPaymentAmount',
      name: t('paymentInvoices.history.table.totalAuthorizedPaymentAmt'),
      selector: (row) => `${row.totalAuthorizedPaymentAmount}`,
      minWidth: '120px',
      sortable: true,
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.totalAuthorizedPaymentAmount || 0} style="currency" currency="USD" />
        </div>
      ),
      right: true
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
            image={EmptyDataImage}
            heading={filteredData ? t('errors.messages.noRecordsFound') : t('paymentInvoices.history.table.emptyData')}
            description={!filteredData && t('paymentInvoices.history.table.emptyDataDescription')}
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
