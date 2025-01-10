import React from 'react';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import EmptyDataTable from '@src/components/EmptyTable';
import { Badge, DropdownMenu, CustomDataTable, Loader } from '@mckesson/mcp-component-library';
import { useTranslate } from '@src/translations/useTranslation';
import dayjs from 'dayjs';
import { FormattedNumber } from 'react-intl';
import { ReactComponent as RemoveCircle } from '@src/assets/svg/cross-red.svg';

const data = [
  {
    currency: 'USD',
    billAmount: 24378.7,
    openAmount: 24378.7,
    paymentTerm: 'Due in 15 days',
    isPdfAvailable: true,
    status: 'OVERDUE',
    billNumber: '3344041234',
    soldToSite: 'act12345',
    billDate: '14/02/2024',
    dueDate: '20/12/2024',
    description: null
  },
  {
    currency: 'USD',
    billAmount: 2134.4,
    openAmount: 2134.4,
    paymentTerm: 'Due in 30 days',
    isPdfAvailable: false,
    status: 'OVERDUE',
    billNumber: '3344041246',
    soldToSite: 'act67654',
    billDate: '09/03/2024',
    dueDate: '08/01/2025',
    description: null
  },
  {
    currency: 'USD',
    billAmount: 5421.3,
    openAmount: 5421.3,
    paymentTerm: 'Due in 35 days',
    isPdfAvailable: true,
    status: null,
    billNumber: '3344041247',
    soldToSite: 'act99887',
    billDate: '10/03/2024',
    dueDate: '15/01/2025',
    description: null
  }
];

function SelectedInvoiceList(props) {
  const { t } = useTranslate();

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
    // {
    //   name: t('paymentInvoices.history.table.PaymentTerm'),
    //   selector: 'paymentTerm',
    //   minWidth: '144px',
    //   id: 'paymentTerm',
    //   wrap: true,
    //   cell: (props) => <div className="status-container">{props?.paymentTerm}</div>
    // },
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
      //   sortable: true,
      id: 'paymentAmount',
      //   wrap: true,
      cell: (props) => <input />
    },
    {
      name: 'Actions',
      minWidth: '240px',
      //   sortable: true,
      id: 'paymentAmount',
      //   wrap: true,
      cell: (props) => (
        <div>
          <RemoveCircle /> REMOVE
        </div>
      )
    }
  ];

  return (
    <CustomDataTable
      id="my-data-table"
      type="normal"
      columns={columns}
      data={data || []}

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
