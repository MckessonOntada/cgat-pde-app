import React, { useState } from 'react';
import { Badge, DropdownMenu,CustomDataTable,Loader } from '@mckesson/mcp-component-library';
import { PaymentInvoicesData } from '../../mockData/PaymentInvoicesData';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import {usePaymentInvoices} from '../../context/PaymentsInvoicesContext';

export default function InvoicesTable() {
  const { t } = useTranslate();
  const [filteredData, setFilteredData] = useState(PaymentInvoicesData);
  // let dataElement = [{ label: 'Payment' }, { label: 'Export PDF' }];
  let dataElement = [{ label: 'Payment' }, { label: 'Export PDF' }];
  // let dataElement = ['Payment', 'Export PDF'];
  const { data, isFetching, paginationConfig, setPageNumber, applySort } = usePaymentInvoices();

  const columns = [
    {
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
      name: t('paymentInvoices.history.table.PostingDate'),
      selector: (row) => row.billDate,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      cell: (props) => <EclipsesTextcss className="cellEllipse" str={props.billDate} maxWidth={240} />
    },

    {
      name: t('paymentInvoices.history.table.PaymentTerm'),
      selector: 'paymentTerm',
      minWidth: '144px',
      sortable: true,
      wrap: true,
      cell: (props) => <div className="status-container">{props.paymentTerm == 'COMPLETED' ? <Badge text="COMPLETED" type="success" /> : <Badge text="IN PROCESS" type="info-default" />}</div>
    },
    {
      name: t('paymentInvoices.history.table.DueDate'),
      selector: (row) => row.dueDate,
      minWidth: '168px',
      sortable: true,
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props.dueDate}</div>
    },
    {
      name: t('paymentInvoices.history.table.OpenAmount'),
      selector: (row) => row.openAmount,
      minWidth: '144px',
      sortable: true,
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props.openAmount}</div>
    },
    {
      name: t('paymentInvoices.history.table.BillAmount'),
      selector: (row) => row?.billAmount,
      minWidth: '200px',
      sortable: true,
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props?.billAmount}</div>
    },
    {
      name: t('paymentInvoices.history.table.Actions'),
      minWidth: '144px',
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div className="cellEllipse actionIcon">
          <DropdownMenu
            anchorEl={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M7.99967 4.33333C9.19629 4.33333 10.1663 3.36328 10.1663 2.16667C10.1663 0.97005 9.19629 0 7.99967 0C6.80306 0 5.83301 0.97005 5.83301 2.16667C5.83301 3.36328 6.80306 4.33333 7.99967 4.33333Z" fill="#181818" />
                <path d="M7.99967 10.1654C9.19629 10.1654 10.1663 9.19531 10.1663 7.9987C10.1663 6.80208 9.19629 5.83203 7.99967 5.83203C6.80306 5.83203 5.83301 6.80208 5.83301 7.9987C5.83301 9.19531 6.80306 10.1654 7.99967 10.1654Z" fill="#181818" />
                <path d="M7.99967 16.0013C9.19629 16.0013 10.1663 15.0313 10.1663 13.8346C10.1663 12.638 9.19629 11.668 7.99967 11.668C6.80306 11.668 5.83301 12.638 5.83301 13.8346C5.83301 15.0313 6.80306 16.0013 7.99967 16.0013Z" fill="#181818" />
              </svg>
            }
            handleSelect={() => {}}
            options={dataElement}
            optionsAlign="left"
            aria-label="Profile options"
          />
        </div>
      )
    }
  ];
  const handleSort = (selectedColumn, sortDirection) => {
    if (selectedColumn.sortKey) applySort({ sortBy: selectedColumn.sortKey, sortOrder: sortDirection });
  };

  const handleChangePage = (e, newPage) => {
    setPageNumber(newPage);
  };
  return (
    <React.Fragment>
      {/* <DataTable columns={columns} rows={filteredData} responsive /> */}
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
