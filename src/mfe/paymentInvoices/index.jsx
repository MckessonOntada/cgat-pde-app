import React, { useEffect, useState } from "react";
import PageHeader from '@src/components/pageHeader';
import './index.scss'
import RecordDetails from "./RecordDetails";
import BalanceDetails from "./BalanceDetails";
import Routes from "./routes/Routes";
import { TabList, Button } from "@mckesson/mcp-component-library";
import { PATHS, tabListData } from "./routes/constants";
import { useLocation, useNavigate } from "react-router-dom";
import ModuleHeader from "../../components/module-header";
import { PaymentInvoiceProvider } from "./context/PaymentContext";


const PaymentsInvoices = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [tabs, setTabs] = useState()

    React.useEffect(() => {
        if (Array.isArray(tabListData) && tabListData.length > 0) {
            const updatedTabs = tabListData.map(item => {
                const isDashboard = item.configName === 'INVOICES' && location.pathname === '/';
                const isMatchingPath = item.path !== PATHS.invoices && location.pathname.includes(item.path);
                return {
                    ...item,
                    isActiveTab: location.pathname.includes(item.path),
                    ariaSelected: (location.pathname.includes(item.path)) ? 'true' : 'false'
                };
            });
            setTabs(updatedTabs);
        }
    }, [location.pathname]);

    return (
        <React.Fragment>
            <PaymentInvoiceProvider>
                <div className="MCP-module-wrapper">
                    <ModuleHeader
                        heading={<PageHeader heading={"Payment Invoices"} />}
                    />
                    <RecordDetails />
                    <BalanceDetails />
                    <div className="MCP-module-body">
                        <div id="tablist-container" className="MCP-panel-container">
                            <TabList
                                options={tabs}
                                alignment="left"
                                onTabClick={(e) => {
                                    navigate(e.path)
                                }}
                                showShadow={false}
                                variant={"text"}
                                useAsButton={true}
                                aria-label={"record-tab-list"}
                            />
                            <Routes />
                        </div>
                    </div>
                </div>
            </PaymentInvoiceProvider>
        </React.Fragment>
    );
};

export default PaymentsInvoices;
