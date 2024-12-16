import React, { useState } from 'react';
import DataTable from '@src/components/dataTable/DataTable';
import { Badge, Button } from '@mckesson/mcp-component-library';
import { PaymentInvoicesData } from '../../mockData/PaymentInvoicesData';
import { Link } from 'react-router-dom';
import { useTranslate } from '@src/translations/useTranslation';
import EclipsesTextcss from '@src/components/EclipsesText/EclipsesTextcss';
import { ReactComponent as PDFicon } from "../../../../assets/svg/office-file-pdf.svg"

export default function CreditsTable() {
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
      id: 'purchaseOrderNumber',
      name: t('paymentInvoices.history.table.SoldToSite'),
      selector: () => {},
      minWidth: '160px',
      sortable: true,
      wrap: true,
      cell: (props) => <div>{props.purchaseOrderNumber}</div>
    },
    {
      name: t('paymentInvoices.credits.table.description'),
      selector: (row) => row.paymentMethod,
      sortable: true,
      wrap: true,
      minWidth: '160px',
      cell: (props) => <EclipsesTextcss className="cellEllipse" str={props.paymentMethod} maxWidth={240} />
    },

    {
      name: t('paymentInvoices.credits.table.validfrom'),
      selector: 'paymentStatus',
      minWidth: '144px',
      sortable: true,
      wrap: true,
      cell: (props) => <div className="status-container">{props.paymentStatus == 'COMPLETED' ? <Badge text="COMPLETED" type="success" /> : <Badge text="IN PROCESS" type="info-default" />}</div>
    },
    {
      name: t('paymentInvoices.credits.table.amount'),
      selector: (row) => row.paymentInitiationDate,
      minWidth: '168px',
      sortable: true,
      wrap: true,
      cell: (props) => <div className="cellEllipse">{props.paymentInitiationDate}</div>
    },
    {
      name: t('paymentInvoices.history.table.Actions'),
      selector: (row) => row.totalAuthorizedPaymentAmt,
      minWidth: '144px',
      sortable: true,
      wrap: true,

      cell: (props) => (
         <Button className="back-button-control" variant="tertiary" Icon={() => <PDFicon />} onClick={()=>{}} size="md">
         {t('paymentInvoices.credits.table.downloadPdf')}
       </Button>
      )
    }
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
