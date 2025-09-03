import React from 'react';
import { Heading, Loader, Button } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { FormattedNumber } from 'react-intl';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import CommonUtils from '@src/util/CommonUtils';

const createColumns = (t, type, pageType) => {
  const commonColumns = [
    {
      name: t('paymentInvoices.history.table.invoiceNumber'),
      id: 'billNumber',
      selector: (row) => `${row.billNo}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cell: (props) => (
        <div className="cellEllipse">
          {/* <Link
            style={{
              color: 'var(--brand-color-primary)',
              fontWeight: '600',
              textDecoration: 'none'
            }}
            to={`/record/invoices/${props?.billNo || ''}/details`}
            state={{
              pageType: pageType
            }}>
            {props?.billNo || ''}
          </Link> */}
          {props?.billNo || ''}
        </div>
      )
    },
    {
      id: 'soldToSite',
      name: t('paymentInvoices.history.table.SoldToAccountNo'),
      selector: (row) => row.soldToSite,
      minWidth: '250px',
      sortable: true,
      wrap: true,
      cardHeader: true,
      showInMobileHeader: true,
      cell: (props) => <div>{props?.soldToAccountNumber || '-'}</div>
    }
  ];

  const invoiceColumns = [
    ...commonColumns,
    {
      name: t('paymentInvoices.history.table.invoiceDate'),
      selector: (row) => row.billDate,
      sortable: true,
      id: 'billDate',
      wrap: true,
      width: '150px',
      cell: (props) => <div className="cellEllipse">{CommonUtils.convertDateStringFormat(props?.billDate, 'MM/DD/YYYY', 'DD/MM/YYYY')}</div>
    },
    {
      name: t('paymentInvoices.history.table.DueDate'),
      selector: (row) => row.dueDate,
      width: '150px',
      sortable: true,
      wrap: true,
      id: 'dueDate',
      cell: (props) => <div className="cellEllipse">{CommonUtils.convertDateStringFormat(props?.dueDate, 'MM/DD/YYYY', 'DD/MM/YYYY')}</div>
    },
    {
      name: t('paymentInvoices.history.table.invoiceAmount'),
      selector: (row) => row?.billAmount,
      minWidth: '120px',
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
      name: t('paymentInvoices.history.table.authorizedAmount'),
      selector: (row) => row?.authAmount,
      minWidth: '200px',
      sortable: true,
      right: true,
      id: 'authorizedPayment',
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.authAmount || 0} style="currency" currency="USD" />
        </div>
      )
    }
  ];

  const creditColumns = [
    ...commonColumns,
    {
      name: t('paymentInvoices.history.table.usedDate'),
      selector: (row) => row.usedDate,
      width: '150px',
      sortable: true,
      wrap: true,
      id: 'usedDate',
      cell: (props) => <div className="cellEllipse">{CommonUtils.convertDateStringFormat(props?.usedDate, 'MM/DD/YYYY', 'DD/MM/YYYY')}</div>
    },
    {
      name: t('paymentInvoices.credits.table.amount'),
      selector: (row) => row?.billAmount,
      minWidth: '150px',
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
      name: t('paymentInvoices.history.table.creditUsed'),
      selector: (row) => row?.authAmount,
      minWidth: '180px',
      sortable: true,
      right: true,
      id: 'authAmount',
      cell: (props) => (
        <div className="cellEllipse align-items-right">
          <FormattedNumber value={props?.authAmount || 0} style="currency" currency="USD" />
        </div>
      )
    }
  ];

  return type === 'invoice' ? invoiceColumns : creditColumns;
};

function ConfirmationTable({ invoiceData, creditData, pageType }) {
  const { t } = useTranslate();
  const showCardView = useResponsiveView();

  return (
    <>
      <Heading as="h2" fontWeight="600">
        {t('paymentInvoices.table.confirmationInvoiceHeading')}
      </Heading>
      <div className="details-table">
        <CustomDataTable
          id="invoice-data-table"
          type="normal"
          columns={createColumns(t, 'invoice', pageType)}
          data={invoiceData || []}
          onSortIconClick={() => {}}
          handleChangePage={() => {}}
          noDataComponent={'No invoice used in this payments'}
          showCardView={showCardView}
          defaultExpandedCardView={false}
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
      {creditData.length > 0 && (
        <>
          <Heading as="h2" fontWeight="600">
            {t('paymentInvoices.table.creditHeading')}
          </Heading>
          <div className="details-table">
            <CustomDataTable
              id="credit-data-table"
              type="normal"
              columns={createColumns(t, 'credit', pageType)}
              data={creditData || []}
              onSortIconClick={() => {}}
              handleChangePage={() => {}}
              noDataComponent={'No credit used in this payments'}
              showCardView={showCardView}
              defaultExpandedCardView={false}
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
      )}
    </>
  );
}

export default ConfirmationTable;
