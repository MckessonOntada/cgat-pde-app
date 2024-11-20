import React from "react";
import { PaymentHistoryProvider } from "../../context/PaymentContext";
import { debugIds, ID } from '@src/common/constants/id';
import Filters from "./Filters";
import PaymentHistoryTable from "./PaymentHistoryTable";
import "./index.scss"

export default function PaymentHistory(params) {
    return (<div className="payment-history-container" >
        <PaymentHistoryProvider>
            <div className="userCardContainer" id={debugIds(ID.FILTERS, ID.FILTER_CONTAINER)}>
                <Filters showRoleDropdown={true} showStatusDropdown={true} />
                <h1> Payment Listing</h1>
                <div className="userList">
                    <PaymentHistoryTable />
                </div>
            </div>
        </PaymentHistoryProvider>
    </div>)
}