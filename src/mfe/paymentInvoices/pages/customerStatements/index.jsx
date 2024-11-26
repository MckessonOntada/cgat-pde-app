import React from "react";
// import { PaymentInvoiceProvider } from "../../context/PaymentContext";
// import { debugIds, ID } from '@src/common/constants/id';
import Filters from "./Filters";
// import PaymentHistoryTable from "./PaymentHistoryTable";
import "./index.scss"
import { Button } from '@mckesson/mcp-component-library';
import CustomerStatementTable from "./CustomerStatementTable";
import { useTranslate } from '@src/translations/useTranslation';

export default function CustomerSatements(params) {
    const { t } = useTranslate();

    return (<React.Fragment >
        <div className="MCP-CardContainer">
            <Filters showRoleDropdown={true} showStatusDropdown={true} />
        </div>
        <div className="MCP-table-wrapper">
            <div className="table-header" >
                <h1> {t('paymentInvoices.CS.StatementListing')}</h1>
                <Button
                    variant="secondary"
                    onClick={() => { }}
                    size="sm"
                >
                    {t('paymentInvoices.CS.ExportExcel')}
                </Button>
            </div>
            <CustomerStatementTable />
        </div>
    </React.Fragment>)
}