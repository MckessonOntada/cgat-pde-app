import React, { useEffect, useState } from 'react';
import EmptyDataTable from '@src/components/EmptyTable';
import { useTranslate } from '@src/translations/useTranslation';
import { FormattedNumber } from 'react-intl';
import { ReactComponent as RemoveCircle } from '@src/assets/svg/cross-red.svg';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { PATHS } from '../../routes';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import CommonUtils from '@src/util/CommonUtils';
import PaymentAmountCell from './PaymentAmountCell';

function SelectedInvoiceList(props) {
  const { t } = useTranslate();
  const { selectedInvoices, setSelectedInvoices } = props;
  const location = useLocation();
  const { state } = location;
  const REVIEW_MODE = state?.reviewMode || false;
  const showCardView = useResponsiveView();

  const columns = [
    {
      name: t('paymentInvoices.history.table.invoiceNumber'),
      id: 'billNumber',
      selector: (row) => `${row.billNumber}`,
      wrap: true,
      minWidth: '150px',
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
            state={{ ...state }}>
            {`${props?.billNumber || ''}`}
          </Link>
        </div>
      )
    },
    {
      id: 'soldToSite',
      name: t('paymentInvoices.history.table.SoldToAccountNo'),
      selector: (row) => row.soldToSite,
      minWidth: '120px',
      wrap: true,
      cell: (props) => <div>{props?.soldToSite || '-'}</div>
    },
    {
      id: 'description',
      name: t('paymentInvoices.Details.Description'),
      selector: (row) => row.description,
      minWidth: '160px',
      wrap: true,
      showInMobileHeader: true,
      cardHeader: true,
      cell: (props) => <div>{props?.description || '-'}</div>
    },
    {
      name: t('paymentInvoices.history.table.PostingDate'),
      selector: (row) => row?.billDate,
      minWidth: '150px',
      id: 'billDate',
      cell: (props) => <div>{CommonUtils.convertDateStringFormat(props?.billDate, 'MM/DD/YYYY', 'DD/MM/YYYY')}</div>
    },
    {
      name: t('paymentInvoices.history.table.DueDate'),
      selector: (row) => row.dueDate,
      maxWidth: '130px',
      minWidth: '105px',
      wrap: true,
      id: 'dueDate',
      cell: (props) => <div>{CommonUtils.convertDateStringFormat(props?.dueDate, 'MM/DD/YYYY', 'DD/MM/YYYY')}</div>
    },
    {
      name: t('paymentInvoices.history.table.invoiceAmount'),
      selector: (row) => row?.billAmount,
      minWidth: '160px',
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
      minWidth: '160px',
      wrap: true,
      id: 'openAmount',
      cell: (props) => (
        <div className="cellEllipse align-items-right ">
          <FormattedNumber value={props?.openAmount || 0} style="currency" currency="USD" />
        </div>
      ),
      right: true
    },
    {
      name: t('paymentInvoices.reviewPayments.paymentAmount'),
      minWidth: '180px',
      id: 'paymentAmount',
      right: true,
      cell: (row, index) => (
        <PaymentAmountCell
          row={row}
          index={index}
          selectedInvoices={selectedInvoices}
          setSelectedInvoices={setSelectedInvoices}
          REVIEW_MODE={REVIEW_MODE}
        />
      )
    },
    {
      name: t('paymentInvoices.history.table.Actions'),
      id: 'paymentAmount',
      cell: (props, index) => (
        <div className={`action-container ${selectedInvoices.length <= 1 ? `in-active` : ``}`} onClick={() => onRemoveInvoice(index)}>
          <RemoveCircle disabled /> {t('paymentInvoices.reviewPayments.remove')}
        </div>
      ),
      omit: REVIEW_MODE,
      isAction: true
    }
  ];

  const onRemoveInvoice = (index) => {
    if (selectedInvoices.length <= 1) {
      return;
    }
    let _invoices = [...[], ...selectedInvoices];
    _invoices.splice(index, 1);
    setSelectedInvoices(_invoices);
  };

  const { omitColumns } = props;

  return (
    <CustomDataTable
      id="my-data-table"
      type="normal"
      columns={columns.filter((col) => !omitColumns?.includes(col.id))}
      data={selectedInvoices || []}
      showCardView={showCardView}
      defaultExpandedCardView={false}
      noDataComponent={
        <EmptyDataTable image={EmptyDataImage} heading={t('paymentInvoices.invoice.table.emptyData')} description={'Please select Invoices from dashboard'} />
      }
    />
  );
}
export default SelectedInvoiceList;
