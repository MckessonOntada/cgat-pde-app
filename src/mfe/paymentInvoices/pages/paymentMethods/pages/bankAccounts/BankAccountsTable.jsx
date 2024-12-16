import React, { useState } from 'react';
import DataTable from '@src/components/dataTable/DataTable';
import { Badge, DropdownMenu } from '@mckesson/mcp-component-library';
import { PaymentInvoicesData } from '@src/mfe/paymentInvoices/mockData/PaymentInvoicesData';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';

export default function PaymentHistoryTable() {
  const { t } = useTranslate();
  const [filteredData, setFilteredData] = useState(PaymentInvoicesData);
  const [showDropdown, setshowDropdown] = useState(null);
  // let dataElement = [{ label: 'Payment' }, { label: 'Export PDF' }];
  let dataElement = [{ label: 'Payment' }, { label: 'Export PDF' }];
  // let dataElement = ['Payment', 'Export PDF'];

  const onClickIcon = (key) => {
    console.log('onClickIcon', key);
    if (showDropdown == key.id) {
      setshowDropdown(null);
    } else {
      setshowDropdown(key.id);
    }
  };
  const columns = [
    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.bankName'),
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
      id: 'purchaseOrderNumber',
      name: t('paymentInvoices.paymentMethods.table.bankAccount.routingNumber'),
      selector: () => {},
      minWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props.purchaseOrderNumber}</div>
    },
    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.bankAccNumber'),
      selector: (row) => row.paymentMethod,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      cell: (props) => <EclipsesTextcss className="cellEllipse" str={props.paymentMethod} maxWidth={240} />
    },

    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.bankCountry'),
      selector: 'paymentStatus',
      minWidth: '144px',
      sortable: true,
      wrap: true,
      cell: (props) => <div className="status-container">{props.paymentStatus == 'COMPLETED' ? <Badge text="COMPLETED" type="success" /> : <Badge text="IN PROCESS" type="info-default" />}</div>
    },
    {
      name: t('paymentInvoices.paymentMethods.table.bankAccount.companyCode'),
      selector: (row) => row.paymentInitiationDate,
      minWidth: '168px',
      sortable: true,
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props.paymentInitiationDate}</div>
    },
  ];
  const handleSortClick = (column, sortDirection) => {
    console.log('column', filteredData, column);
    const sortedData = filteredData.sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[column.selector] > b[column.selector] ? 1 : -1;
      } else {
        return a[column.selector] < b[column.selector] ? 1 : -1;
      }
    });
    setFilteredData([...sortedData]);
  };
  return (
    <React.Fragment>
      <DataTable columns={columns} rows={filteredData} responsive handleSortClick={handleSortClick} />
    </React.Fragment>
  );
}
