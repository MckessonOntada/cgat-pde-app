import React from 'react';
import EmptyDataTable from '@src/components/EmptyTable';
import { Badge, DropdownMenu, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import { FormattedNumber } from 'react-intl';
import { ReactComponent as RemoveCircle } from '@src/assets/svg/cross-red.svg';
import EmptyDataImage from '@src/assets/image/EmptyDataTable.svg';
import { showSnackbar } from '@src/store/reducer/snackbarReducer';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { PATHS } from '../../routes';
import { CustomDataTable } from '@src/components/dataTableComponent';
import useResponsiveView from '@src/hooks/useResponsiveView';
import CommonUtils from '@src/util/CommonUtils';

function SelectedInvoiceList(props) {
  const { t } = useTranslate();
  const { selectedInvoices, setSelectedInvoices } = props;
  const dispatch = useDispatch();
  const location = useLocation();
  const { state } = location;
  const REVIEW_MODE = state?.reviewMode || false;
  const showCardView = useResponsiveView();

  const columns = [
    {
      name: t('paymentInvoices.history.table.bill.id'),
      id: 'billNumber',
      selector: (row) => `${row.billNumber}`,
      wrap: true,
      minWidth: '112px',
      showInMobileHeader: true,
      showColumnNameInHeader: true,
      cell: (props) => (
        <div className="cellEllipse">
          <Link
            style={{ color: 'var(--brand-color-primary)', fontWeight: '600', textDecoration: 'none' }}
            // to={`/record/${PATHS.credits}/${props?.billNumber}/details`}
            to={`/record/${PATHS.invoices}/${props?.billNumber}/details`}
            state={{ ...state }}>
            {`${props?.billNumber || ''}`}
          </Link>
        </div>
      )
    },
    {
      id: 'soldToSite',
      name: t('paymentInvoices.history.table.SoldToSite'),
      selector: (row) => row.soldToSite,
      minWidth: '160px',
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
      name: t('paymentInvoices.history.table.DueDate'),
      selector: (row) => row.dueDate,
      maxWidth: '130px',
      wrap: true,
      id: 'dueDate',
      cell: (props) => <div>{CommonUtils.convertDateStringFormat(props?.dueDate, 'MM/DD/YYYY', 'DD/MM/YYYY')}</div>
    },
    {
      name: t('paymentInvoices.history.table.BillAmount'),
      selector: (row) => row?.billAmount,
      minWidth: '140px',
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
      minWidth: '144px',
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
      minWidth: '240px',
      id: 'paymentAmount',
      right: true,
      cell: (props, index) =>
        REVIEW_MODE ? (
          <div className="cellEllipse align-items-right ">
            <FormattedNumber value={props.paymentAmount || 0} style="currency" currency="USD" />
          </div>
        ) : (
          <input
            type="number"
            className={`paymenyAmount-input ${
              props.paymentAmount > props.openAmount || props.paymentAmount <= 0 || !props.paymentAmount ? `error-input` : ``
            }`}
            value={props.paymentAmount}
            onChange={(e) => onChangePayAmount(e, index)}
            min={0}
            onBlur={(e) => onBlurPayAmount(e, index, props)}
          />
        )
    },
    {
      name: t('paymentInvoices.history.table.Actions'),
      minWidth: '160px',
      id: 'paymentAmount',
      cell: (props, index) => (
        <div
          className={`action-container ${selectedInvoices.length <= 1 ? `in-active` : ``}`}
          onClick={selectedInvoices.length <= 1 ? null : () => onRemoveInvoice(index)}>
          <RemoveCircle disabled /> {t('paymentInvoices.reviewPayments.remove')}
        </div>
      ),
      omit: REVIEW_MODE,
      isAction: true
    }
  ];

  const onChangePayAmount = (event, index) => {
    let _invoices = [...[], ...selectedInvoices];
    _invoices[index].paymentAmount = event.target.value;
    setSelectedInvoices(_invoices);
  };

  const onBlurPayAmount = (event, index, rowData) => {
    if (event.target.value <= 0 || event.target.value > rowData.openAmount) {
      let _invoices = [...[], ...selectedInvoices];
      _invoices[index].paymentAmount = rowData.openAmount;
      setSelectedInvoices(_invoices);
    }
  };

  const onRemoveInvoice = (index) => {
    let _invoices = [...[], ...selectedInvoices];
    _invoices.splice(index, 1);
    setSelectedInvoices(_invoices);
  };

  return (
    <CustomDataTable
      id="my-data-table"
      type="normal"
      columns={columns}
      data={selectedInvoices || []}
      showCardView={showCardView}
      defaultExpandedCardView={false}
      noDataComponent={
        <EmptyDataTable
          image={EmptyDataImage}
          heading={t('paymentInvoices.invoice.table.emptyData')}
          description={'Please select Invoices from dashboard'}
        />
      }
    />
  );
}
export default SelectedInvoiceList;
