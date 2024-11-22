import React, { useState } from "react";
import DataTable from '@src/components/dataTable/DataTable';
import { Badge } from '@mckesson/mcp-component-library';
import { Link } from "react-router-dom";
import { useTranslate } from '@src/translations/useTranslation';
import { customerStatementDta } from "../../mockData/CustomerStatements";
import { ReactComponent as PDFicon } from "../../../../assets/svg/office-file-pdf.svg"
export default function CustomerStatementTable() {
    const { t } = useTranslate();
    const [filteredData, setFilteredData] = useState(customerStatementDta);
    const [isOpen, setIsOpen] = useState(false)
    const columns = [
        {
            name: t('paymentInvoices.CS.table.billNumber'),
            selector: () => { },
            sortable: true,
            wrap: true,
            cell: (props) => (
                <div className="action-cotainer" onClick={() => setIsOpen(true)} >
                    {`${props.billNo}`}
                </div>
            )
        },
        {
            id: "purchaseOrderNumber",
            name: t('paymentInvoices.CS.table.accountnumber'),
            selector: () => { },
            sortable: true,
            cell: (props) => <div>{props.accountNo}</div>
        },
        {
            name: t('paymentInvoices.CS.table.date'),
            selector: () => { },
            wrap: true,
            sortable: true,
            cell: (props) => <div className="cellEllipse">{props.date}</div>
        },
        {
            name: <div className="align-items-right" >
                {t('paymentInvoices.CS.table.statementBalance')}
            </div>,
            selector: 'statementBalance',
            sortable: true,
            width: '25%',
            cell: (props) => (
                <div className="align-items-right" >
                    ${props.statementBalance}
                </div>
            )
        },
        {
            name: t('paymentInvoices.CS.table.actions'),
            selector: () => { },
            width: "20%",
            cell: (props) => <div className="action-cotainer"><PDFicon /> EXPORT PDF </div>
        },
    ];
    return (
        <React.Fragment>
            <DataTable
                columns={columns}
                rows={filteredData}
                responsive
                handleSortClick={(event) => { console.log('event...', event) }}
            />
        </React.Fragment>
    )
}