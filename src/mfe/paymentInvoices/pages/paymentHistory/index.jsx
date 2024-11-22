import React from "react";
import { PaymentInvoiceProvider } from "../../context/PaymentContext";
import { debugIds, ID } from '@src/common/constants/id';
import Filters from "./Filters";
import PaymentHistoryTable from "./PaymentHistoryTable";
import "./index.scss"
import { Button } from '@mckesson/mcp-component-library';

export default function PaymentHistory(params) {
    return (<React.Fragment >
        <div className="MCP-CardContainer">
            <Filters showRoleDropdown={true} showStatusDropdown={true} />
        </div>
        <div className="MCP-table-wrapper">
            <div className="table-header" >
                <h1> Payment Listing</h1>
                <Button
                    variant="secondary"
                    onClick={() => { }}
                    size="sm"
                >
                    Export Excel
                </Button>
            </div>
            <PaymentHistoryTable />
        </div>
    </React.Fragment>)
}