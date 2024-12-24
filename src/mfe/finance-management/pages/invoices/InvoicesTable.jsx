import React from 'react';
import { Badge, DropdownMenu, CustomDataTable, Loader } from '@mckesson/mcp-component-library';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { usePaymentInvoices } from '../../context/PaymentsInvoicesContext';
import { FormattedNumber } from 'react-intl';
import { ReactComponent as ActionIcon } from '@src/assets/image/actionIcon.svg';
import EmptyDataTable from '@src/components/EmptyTable';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import dayjs from 'dayjs';

export default function InvoicesTable() {
  const { t } = useTranslate();
  let dataElement = [{ label: 'Payment' }, { label: 'Export PDF' }];
  const { data, isFetching, paginationConfig, setPageNumber, applySort, isError } = usePaymentInvoices();

  const columns = [
    {
      name: t('paymentInvoices.history.table.billNumber'),
      id: 'billNumber',
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
      cell: (props) => <div>{props.soldToSite || '-'}</div>
    },
    {
      name: t('paymentInvoices.history.table.PostingDate'),
      selector: (row) => row.billDate,
      sortable: true,
      id: 'billDate',
      wrap: true,
      minWidth: '160px',
      cell: (props) => (
        <EclipsesTextcss className="cellEllipse" str={dayjs(props.billDate, 'DD/MM/YYYY')?.format('MM/DD/YYYY') || '-'} maxWidth={240} />
      )
    },

    {
      name: t('paymentInvoices.history.table.PaymentTerm'),
      selector: 'paymentTerm',
      minWidth: '144px',
      id: 'paymentTerm',
      wrap: true,
      cell: (props) => <div className="status-container">{props.paymentTerm}</div>
    },
    {
      name: t('paymentInvoices.history.table.DueDate'),
      selector: (row) => row.dueDate,
      minWidth: '168px',
      sortable: true,
      wrap: true,
      id: 'dueDate',
      cell: (props) => <div className="cellEllipse">{dayjs(props.dueDate, 'DD/MM/YYYY')?.format('MM/DD/YYYY') || '-'}</div>
    },
    {
      name: t('paymentInvoices.history.table.OpenAmount'),
      selector: (row) => row.openAmount,
      minWidth: '144px',
      sortable: true,
      center: true,
      wrap: true,
      id: 'openAmount',
      cell: (props) => (
        <div className="cellEllipse">
          <FormattedNumber value={props?.openAmount} style="currency" currency="USD" />
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.status'),
      selector: (row) => row.status,
      minWidth: '170px',
      sortable: true,
      center: true,
      wrap: true,
      id: 'status',
      cell: (props) => (
        <div className="status-container">
          {props.status == 'PLUS_91_DAYS_OVERDUE' ? (
            <Badge text="+91 DAYS OVERDUE" type="error-default" />
          ) : (
            <Badge text={`${props.status.match(/\d+/)[0]} DAYS OVERDUE`} type="warning-default" />
          )}
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.BillAmount'),
      selector: (row) => row?.billAmount,
      minWidth: '140px',
      sortable: true,
      wrap: true,
      center: true,
      id: 'billAmount',
      cell: (props) => (
        <div className="cellEllipse">
          <FormattedNumber value={props?.billAmount} style="currency" currency="USD" />
        </div>
      )
    }
    // {
    //   name: t('paymentInvoices.history.table.Actions'),
    //   minWidth: '144px',
    //   sortable: true,
    //   id: 'actions',
    //   wrap: true,
    //   cell: (props) => (
    //     <div className="cellEllipse actionIcon">
    //       <DropdownMenu
    //         anchorEl={<ActionIcon />}
    //         handleSelect={() => {}}
    //         options={dataElement}
    //         optionsAlign="left"
    //         aria-label="Profile options"
    //       />
    //     </div>
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
            heading={t('paymentInvoices.invoice.table.emptyData')}
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
