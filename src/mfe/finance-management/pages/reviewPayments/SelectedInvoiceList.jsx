import React, { useEffect, useState } from 'react';
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
      minWidth: '100px',
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
      cell: (props) => (
        <div>
          {CommonUtils.convertDateStringFormat(
            props?.billDate,
            'MM/DD/YYYY',
            'DD/MM/YYYY'
          )}
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.DueDate'),
      selector: (row) => row.dueDate,
      maxWidth: '130px',
      minWidth: '105px',
      wrap: true,
      id: 'dueDate',
      cell: (props) => (
        <div>
          {CommonUtils.convertDateStringFormat(
            props?.dueDate,
            'MM/DD/YYYY',
            'DD/MM/YYYY'
          )}
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.BillAmount'),
      selector: (row) => row?.billAmount,
      minWidth: '160px',
      right: true,
      id: 'billAmount',
      cell: (props) => (
        <div className="cellEllipse align-items-right ">
          <FormattedNumber
            value={props?.billAmount || 0}
            style="currency"
            currency="USD"
          />
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
          <FormattedNumber
            value={props?.openAmount || 0}
            style="currency"
            currency="USD"
          />
        </div>
      ),
      right: true
    },
    {
      name: t('paymentInvoices.reviewPayments.paymentAmount'),
      minWidth: '180px',
      id: 'paymentAmount',
      right: true,
      cell: (props, index) => {
        const [inputValue, setInputValue] = useState(props.paymentAmount);

        useEffect(() => {
          setInputValue(props.paymentAmount);
        }, [props.paymentAmount]);

        const handleChange = (e) => {
          setInputValue(e.target.value);
          let _invoices = [...[], ...selectedInvoices];
          _invoices[index].paymentAmount = e.target.value;
          setSelectedInvoices(_invoices)
        };

        const handleBlur = (e) => {
          const val = parseFloat(e.target.value);
          const finalVal = val > 0 && val <= props.openAmount ? val : props.openAmount;
          let _invoices = [...selectedInvoices];
          _invoices[index].paymentAmount = finalVal;
          setInputValue(finalVal);
          setSelectedInvoices(_invoices);
        };

        const isError =
          inputValue > props.openAmount ||
          inputValue <= 0 ||
          inputValue === '' ||
          inputValue === null;

        return REVIEW_MODE ? (
          <div className="cellEllipse align-items-right ">
            <FormattedNumber
              value={props.paymentAmount || 0}
              style="currency"
              currency="USD"
            />
          </div>
        ) : (
          <input
            type="number"
            className={`paymenyAmount-input ${isError ? 'error-input' : ''}`}
            value={inputValue}
            onChange={handleChange}
            min={0}
            onBlur={handleBlur}
          />
        )
      }
    },
    {
      name: t('paymentInvoices.history.table.Actions'),
      id: 'paymentAmount',
      cell: (props, index) => (
        <div
          className={`action-container ${
            selectedInvoices.length <= 1 ? `in-active` : ``
          }`}
          onClick={() => onRemoveInvoice(index)}>
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
