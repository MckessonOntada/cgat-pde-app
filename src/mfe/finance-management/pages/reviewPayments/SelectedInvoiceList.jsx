import React from 'react';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import EmptyDataTable from '@src/components/EmptyTable';
import { Badge, DropdownMenu, CustomDataTable, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import dayjs from 'dayjs';
import { FormattedNumber } from 'react-intl';
import { ReactComponent as RemoveCircle } from '@src/assets/svg/cross-red.svg';

function SelectedInvoiceList(props) {
  const { t } = useTranslate();
  const { selectedInvoices, setSelectedInvoices } = props;
  const columns = [
    {
      name: t('paymentInvoices.history.table.billNumber'),
      id: 'billNumber',
      selector: (row) => `${row.billNumber}`,
      sortable: true,
      wrap: true,
      minWidth: '112px',
      cell: (props) => <div className="cellEllipse">{`${props?.billNumber || ''}`}</div>
    },
    {
      id: 'soldToSite',
      name: t('paymentInvoices.history.table.SoldToSite'),
      selector: (row) => row.soldToSite,
      minWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props?.soldToSite || '-'}</div>
    },
    {
      name: 'Description',
      selector: (row) => row.description,
      sortable: true,
      id: 'description',
      wrap: true,
      minWidth: '160px',
      cell: (props) => <EclipsesTextcss className="cellEllipse" str={props.description || '-'} maxWidth={240} />
    },
    {
      name: t('paymentInvoices.history.table.DueDate'),
      selector: (row) => row.dueDate,
      minWidth: '168px',
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
        <div className="cellEllipse align-items-right ">
          <FormattedNumber value={props?.billAmount || 0} style="currency" currency="USD" />
        </div>
      )
    },
    {
      name: t('paymentInvoices.history.table.OpenAmount'),
      selector: (row) => row.openAmount,
      minWidth: '144px',
      sortable: true,
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
      name: 'payment Amount',
      minWidth: '240px',
      id: 'paymentAmount',
      right: true,
      cell: (props, index) => (
        <input
          type="number"
          className={`paymenyAmount-input ${
            props.paymentAmount > props.openAmount || props.paymentAmount < 0 || !props.paymentAmount ? `error-input` : ``
          }`}
          value={props.paymentAmount}
          onChange={(e) => onChangePayAmount(e, index)}
        />
      )
    },
    {
      name: 'Actions',
      minWidth: '160px',
      id: 'paymentAmount',
      //   center: true,
      cell: (props, index) => (
        <div className="action-container" onClick={() => onRemoveInvoice(index)}>
          <RemoveCircle disabled /> REMOVE
        </div>
      )
    }
  ];

  const onChangePayAmount = (event, index) => {
    console.log('eve...', event, index);
    let _invoices = [...[], ...selectedInvoices];
    _invoices[index].paymentAmount = event.target.value;
    setSelectedInvoices(_invoices);
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

      //    progressPending={isFetching}
      //   noDataComponent={
      //     <EmptyDataTable
      //       isLoading={isFetching}
      //       error={isError ? 'Something went wrong! Please try again' : null}
      //       image={EmptyDataImage}
      //       heading={t('paymentInvoices.invoice.table.emptyData')}
      //       description={t('paymentInvoices.history.table.emptyDataDescription')}
      //     />
      //   }
      //   progressComponent={
      //     <div
      //       style={{
      //         alignItems: 'center',
      //         border: '1px solid #ccc',
      //         display: 'flex',
      //         height: '350px',
      //         justifyContent: 'center'
      //       }}>
      //       <Loader variant="circular" />
      //     </div>
      //   }
    />
  );
}
export default SelectedInvoiceList;
