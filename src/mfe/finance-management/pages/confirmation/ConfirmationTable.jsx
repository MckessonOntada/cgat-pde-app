import React from 'react';
import { Heading, Loader, CustomDataTable } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { FormattedNumber } from 'react-intl';

const createColumns = (t, type) => {
  const commonColumns = [
    {
      name: t('paymentInvoices.history.table.billNumber'),
      id: 'billNumber',
      selector: (row) => `${row.billNumber}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      cell: (props) => (
        <div className="cellEllipse">
          <Link style={{ color: '#007bff', fontWeight: '600', textDecoration: 'none' }}>{`${props?.billNumber || ''}`}</Link>
        </div>
      )
    },
    {
      id: 'soldToSite',
      name: t('paymentInvoices.history.table.SoldToSite'),
      selector: (row) => row.soldToSite,
      minWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props?.soldToSite || '-'}</div>
    }
  ];

  const invoiceColumns = [
    ...commonColumns,
    {
      name: t('paymentInvoices.history.table.PostingDate'),
      selector: (row) => row.billDate,
      sortable: true,
      id: 'billDate',
      wrap: true,
      minWidth: '160px',
      cell: (props) => <div className="cellEllipse">{dayjs(props?.billDate, 'DD/MM/YYYY')?.format('MM/DD/YYYY') || '-'}</div>
    },
    {
      name: t('paymentInvoices.history.table.DueDate'),
      selector: (row) => row.dueDate,
      minWidth: '140px',
      sortable: true,
      wrap: true,
      id: 'dueDate',
      cell: (props) => <div className="cellEllipse">{dayjs(props?.dueDate, 'DD/MM/YYYY')?.format('MM/DD/YYYY') || '-'}</div>
    },
    {
      name: t('paymentInvoices.history.table.BillAmount'),
      selector: (row) => row?.billAmount,
      minWidth: '140px',
      sortable: true,
      right: true,
      id: 'billAmount',
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.billAmount || 0} style="currency" currency="USD" />
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.authorizedPayment'),
      selector: (row) => row?.authorizedPayment,
      minWidth: '140px',
      sortable: true,
      right: true,
      id: 'authorizedPayment',
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.authorizedPayment || 0} style="currency" currency="USD" />
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

  const creditColumns = [
    ...commonColumns,
    {
      name: t('paymentInvoices.credits.table.description'),
      selector: (row) => row.description,
      sortable: true,
      id: 'description',
      wrap: true,
      minWidth: '160px',
      cell: (props) => <div>{props?.description || '-'}</div>
    },
    {
      name: t('paymentInvoices.history.table.usedDate'),
      selector: (row) => row.usedDate,
      minWidth: '140px',
      sortable: true,
      wrap: true,
      id: 'usedDate',
      cell: (props) => <div className="cellEllipse">{dayjs(props?.usedDate, 'DD/MM/YYYY')?.format('MM/DD/YYYY') || '-'}</div>
    },
    {
      name: t('paymentInvoices.credits.table.amount'),
      selector: (row) => row?.amount,
      minWidth: '140px',
      sortable: true,
      right: true,
      id: 'amount',
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.amount || 0} style="currency" currency="USD" />
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.creditUsed'),
      selector: (row) => row?.creditUsed,
      minWidth: '140px',
      sortable: true,
      right: true,
      id: 'creditUsed',
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.creditUsed || 0} style="currency" currency="USD" />
        </div>
      )
    }
  ];

  return type === 'invoice' ? invoiceColumns : creditColumns;
};

function ConfirmationTable({ invoiceData, creditData, isFetching }) {
  const { t } = useTranslate();

  return (
    <>
      <Heading as="h1" fontWeight="600">
        Invoice List
      </Heading>
      <div className="details-table">
        <CustomDataTable
          id="invoice-data-table"
          type="normal"
          columns={createColumns(t, 'invoice')}
          data={invoiceData || []}
          onSortIconClick={() => {}}
          handleChangePage={() => {}}
          noDataComponent={'No invoice used in this payments'}
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
      </div>

      <Heading as="h1" fontWeight="600">
        Credit List
      </Heading>
      <div className="details-table">
        <CustomDataTable
          id="credit-data-table"
          type="normal"
          columns={createColumns(t, 'credit')}
          data={creditData || []}
          onSortIconClick={() => {}}
          handleChangePage={() => {}}
          noDataComponent={'No credit used in this payments'}
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
      </div>
    </>
  );
}

export default ConfirmationTable;
