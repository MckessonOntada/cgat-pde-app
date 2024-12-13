import React, { useState } from 'react';
import DataTable from '@src/components/dataTable/DataTable';
import { Badge } from '@mckesson/mcp-component-library';
import { PaymentHistoryData } from '../../mockData/PaymentHistoryData';
import { Link } from 'react-router-dom';
import FloatingDrawer from '../../../../components/floating-drawer';
import PaymentDetails from './PaymentDetails';
import { useTranslate } from '@src/translations/useTranslation';

export default function PaymentHistoryTable() {
  const { t } = useTranslate();
  const [filteredData, setFilteredData] = useState(PaymentHistoryData);
  const [isOpen, setIsOpen] = useState(false);
  const columns = [
    {
      name: t('paymentInvoices.history.table.confirmationNumber'),
      selector: (row) => `${row.ConfirmationNumber}`,
      sortable: true,
      wrap: true,
      cell: (props) => (
        <div className="cellEllipse" onClick={() => setIsOpen(true)}>
          <Link style={{ color: '#007bff', fontWeight: '600' }}>{`${props.ConfirmationNumber}`}</Link>
        </div>
      )
    },
    {
      id: 'PurchaseOrderNumber',
      name: t('paymentInvoices.history.table.purchaseOrderNumber'),
      selector: () => {},
      cell: (props) => <div>{props.PurchaseOrderNumber}</div>
    },
    {
      name: t('paymentInvoices.history.table.paymentMethod'),
      selector: (row) => {},
      wrap: true,
      width: '20%',
      cell: (props) => <div className="cellEllipse">{props.PaymentMethod}</div>
    },

    {
      name: t('paymentInvoices.history.table.paymentInitiationDate'),
      selector: (row) => {},
      width: '20%',
      cell: (props) => <div className="cellEllipse">{props.PaymentInitiationDate}</div>
    },
    {
      name: t('paymentInvoices.history.table.paymentStatus'),
      selector: 'paymentStatus',
      cell: (props) => <div className="status-container">{props.PaymentStatus == 'COMPLETED' ? <Badge text="COMPLETED" type="success" /> : <Badge text="IN PROCESS" type="info-default" />}</div>
    },
    {
      name: <div className="align-items-right">{t('paymentInvoices.history.table.totalAuthorizedPaymentAmt')}</div>,
      selector: (row) => {},
      width: '20%',
      cell: (props) => <div className="align-items-right">${props.TotalAuthorizedPaymentAmt}</div>
    }
  ];
  return (
    <React.Fragment>
      <DataTable columns={columns} rows={filteredData} responsive />
      <FloatingDrawer open={isOpen} anchor="right" onClose={() => setIsOpen(false)}>
        <PaymentDetails />
      </FloatingDrawer>
    </React.Fragment>
  );
}
