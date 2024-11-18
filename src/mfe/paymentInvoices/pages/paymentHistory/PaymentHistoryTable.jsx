import React, { useState } from "react";
import DataTable from '@src/components/dataTable/DataTable';
import { Badge } from '@mckesson/mcp-component-library';
import { PaymentHistoryData } from "../../mockData/PaymentHistoryData";
import { Link } from "react-router-dom";
import FloatingDrawer from "../../../../components/floating-drawer";
import PaymentDetails from "./PaymentDetails";
import { useTranslate } from '@src/translations/useTranslation';

export default function PaymentHistoryTable() {
    const { t } = useTranslate();
    const [filteredData, setFilteredData] = useState(PaymentHistoryData);
    const [isOpen, setIsOpen] = useState(false)
    const columns = [
        {
            name: t('paymentInvoices.history.table.billNumber'),
            selector: row => `${row.billNumber}`,
            sortable: true,
            wrap: true,
            cell: (props) => (
                <div className="cellEllipse" onClick={() => setIsOpen(true)} >
                    <Link style={{ color: '#007bff', fontWeight: '600' }} >
                        {`${props.billNumber}`}
                    </Link>
                </div>
            )
        },
        {
            name: t('paymentInvoices.history.table.purchaseOrderNumber'),
            selector: 'purchaseOrderNumber',
            cell: (props) => <div>{props.purchaseOrderNumber}</div>
        },
        {
            name: t('paymentInvoices.history.table.paymentMethod'),
            selector: row => row.paymentMethod,
            wrap: true,
            width: '20%',
            cell: (props) => <div className="cellEllipse">{props.paymentMethod}</div>
        },

        {
            name: t('paymentInvoices.history.table.paymentStatus'),
            selector: 'paymentStatus',
            cell: (props) => (
                <div className="status-container" >
                    {props.paymentStatus == "COMPLETED" ? (
                        <Badge text="COMPLETED" type="success" />
                    ) : (
                        <Badge text="IN PROCESS" type="info-default" />
                    )}
                </div>
            )
        },
        {
            name: t('paymentInvoices.history.table.paymentInitiationDate'),
            selector: row => row.paymentInitiationDate,
            // sortable: true,
            // wrap: true,
            width: '20%',
            cell: (props) => <div className="cellEllipse">{props.paymentInitiationDate}</div>
        },
        {
            name: t('paymentInvoices.history.table.totalAuthorizedPaymentAmt'),
            selector: row => row.totalAuthorizedPaymentAmt,
            // sortable: true,
            // wrap: true,
            width: '20%',
            cell: (props) => <div className="cellEllipse">{props.totalAuthorizedPaymentAmt}</div>
        },
    ];
    return (
        <React.Fragment>
            <DataTable
                columns={columns}
                rows={filteredData}
                responsive
            />
            <FloatingDrawer open={isOpen} anchor='right' onClose={() => setIsOpen(false)}>
                <PaymentDetails />
            </FloatingDrawer>
        </React.Fragment>
    )
}